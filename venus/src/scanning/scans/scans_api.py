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

from fastapi import APIRouter, Response
from sqlalchemy import select
from starlette.status import HTTP_200_OK

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import Scan
from src.db.session import SessionDep
from src.error.error_model import VenusErrorCode, VenusErrorResponses
from src.error.venus_error import VenusError
from src.scanning.scans.check_can_scan import check_whether_can_scan
from src.scanning.scans.try_interrupt_scan import try_interrupt_scan
from src.scanning.scans.scan_model import ScansResponse, ScanDto
from src.scanning.scans.enqueue_library_scan import enqueue_library_scan

router = APIRouter(prefix="/scans")


@router.get("", response_model=ScansResponse, responses=VenusErrorResponses)
def get_all_scans(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    scans = session.execute(select(Scan)).scalars()

    return ScansResponse(scans=[ScanDto.from_entity(scan) for scan in scans])


@router.get("/recent", response_model=ScanDto, responses=VenusErrorResponses)
def get_recent_scan(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    scan = session.execute(
        select(Scan).order_by(Scan.enqueued_at.desc()).limit(1)
    ).scalar()
    if not scan:
        raise VenusError.not_found()

    return ScanDto.from_entity(scan)


@router.post("", response_model=ScanDto, responses=VenusErrorResponses)
def request_scan(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    if not check_whether_can_scan(session):
        raise VenusError.bad(VenusErrorCode.scan_already_ongoing)

    return enqueue_library_scan(session)


@router.delete("", responses=VenusErrorResponses)
def interrupt_scan(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    if check_whether_can_scan(session):
        raise VenusError.bad(VenusErrorCode.no_ongoing_scan)

    try_interrupt_scan(session)

    return Response(status_code=HTTP_200_OK)
