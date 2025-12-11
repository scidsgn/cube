#  CUBE
#  Copyright (C) 2025  scidsgn
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published
#  by the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Affero General Public License for more details.
#  You should have received a copy of the GNU Affero General Public License
#  along with this program.  If not, see <https://www.gnu.org/licenses/>.

from datetime import datetime

from fastapi import APIRouter
from sqlalchemy import select, func
from starlette.responses import Response
from starlette.status import HTTP_204_NO_CONTENT

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import NoSplitEntry
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError
from src.metadata.no_split_list.no_split_model import (
    NoSplitEntriesResponse,
    NoSplitEntryDto,
    NoSplitUpsertRequest,
)

router = APIRouter(prefix="/no-split-list")


@router.get("", response_model=NoSplitEntriesResponse, responses=VenusErrorResponses)
def get_no_split_entries(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    entries = session.execute(
        select(NoSplitEntry).order_by(NoSplitEntry.added_at)
    ).scalars()

    return NoSplitEntriesResponse.from_entity(entries)


@router.post("", response_model=NoSplitEntryDto, responses=VenusErrorResponses)
def create_no_split_entry(
    request: NoSplitUpsertRequest, session: SessionDep, chamberlock: ChamberlockDep
):
    chamberlock.ensure_admin()

    existing_entry_q = select(NoSplitEntry).filter(
        func.lower(NoSplitEntry.name) == request.name.lower()
    )
    existing_entry = session.execute(existing_entry_q).scalar()
    if existing_entry:
        raise VenusError.conflict()

    entry = NoSplitEntry(
        name=request.name, added_at=datetime.now(), updated_at=datetime.now()
    )
    session.add(entry)
    session.flush()

    entry_dto = NoSplitEntryDto.from_entity(entry)
    session.commit()

    return entry_dto


@router.put(
    "/{entry_id}", response_model=NoSplitEntryDto, responses=VenusErrorResponses
)
def update_no_split_entry(
    entry_id: int,
    request: NoSplitUpsertRequest,
    session: SessionDep,
    chamberlock: ChamberlockDep,
):
    chamberlock.ensure_admin()

    existing_entry_q = select(NoSplitEntry).filter(
        func.lower(NoSplitEntry.name) == request.name.lower()
    )
    existing_entry = session.execute(existing_entry_q).scalar()
    if existing_entry and existing_entry.id != entry_id:
        raise VenusError.conflict()

    if existing_entry and existing_entry.id == entry_id:
        return NoSplitEntryDto.from_entity(existing_entry)

    entry = session.execute(
        select(NoSplitEntry).where(NoSplitEntry.id == entry_id)
    ).scalar()
    if entry is None:
        raise VenusError.not_found()

    entry.name = request.name
    entry.updated_at = datetime.now()

    entry_dto = NoSplitEntryDto.from_entity(entry)
    session.commit()

    return entry_dto


@router.delete("/{entry_id}", responses=VenusErrorResponses)
def delete_no_split_entry(
    entry_id: int, session: SessionDep, chamberlock: ChamberlockDep
):
    chamberlock.ensure_admin()

    entry = session.execute(
        select(NoSplitEntry).where(NoSplitEntry.id == entry_id)
    ).scalar()
    if entry is None:
        raise VenusError.not_found()

    session.delete(entry)
    session.commit()

    return Response(status_code=HTTP_204_NO_CONTENT)
