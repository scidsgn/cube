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

from pathlib import Path

from fastapi import APIRouter
from sqlalchemy import select
from starlette.responses import Response
from starlette.status import HTTP_204_NO_CONTENT

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import LibraryFolder
from src.db.session import SessionDep
from src.env import env
from src.error.error_model import VenusErrorResponses, VenusErrorCode
from src.error.venus_error import VenusError
from src.scanning.folders.folder_model import (
    FoldersResponse,
    FolderDto,
    FolderAddRequest,
)

router = APIRouter(prefix="/folders")


@router.get("", response_model=FoldersResponse, responses=VenusErrorResponses)
def get_folders(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    folders = session.execute(select(LibraryFolder)).scalars()

    return FoldersResponse.from_entity(folders)


@router.get("/{folder_id}", response_model=FolderDto, responses=VenusErrorResponses)
def get_folder(folder_id: int, session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    folder = session.execute(
        select(LibraryFolder).where(LibraryFolder.id == folder_id)
    ).scalar()
    if folder is None:
        raise VenusError.not_found()

    return FolderDto.from_entity(folder)


@router.post("", response_model=FolderDto, responses=VenusErrorResponses)
def add_folder(
    request: FolderAddRequest, session: SessionDep, chamberlock: ChamberlockDep
):
    chamberlock.ensure_admin()

    existing_folders = session.execute(select(LibraryFolder)).scalars()
    existing_folder_paths = [folder.path for folder in existing_folders]

    clean_path = "/".join(
        subpath for subpath in request.path.split("/") if len(subpath)
    )
    if clean_path == "":
        raise VenusError.bad(VenusErrorCode.path_is_root)

    if clean_path in existing_folder_paths:
        raise VenusError.conflict()

    possible_subpath = next(
        (path for path in existing_folder_paths if path.startswith(f"{clean_path}/")),
        None,
    )
    if possible_subpath is not None:
        raise VenusError.bad(VenusErrorCode.path_is_superset)

    possible_superpath = next(
        (path for path in existing_folder_paths if clean_path.startswith(f"{path}/")),
        None,
    )
    if possible_superpath is not None:
        raise VenusError.bad(VenusErrorCode.path_already_covered)

    path = Path(env.MEDIA_DRIVE) / clean_path
    if not path.exists() or not path.is_dir():
        raise VenusError.bad(VenusErrorCode.invalid_folder_path)

    folder = LibraryFolder(path=clean_path, invalid_reason="")
    session.add(folder)
    session.flush()

    folder_dto = FolderDto.from_entity(folder)
    session.commit()

    return folder_dto


@router.delete("/{folder_id}", responses=VenusErrorResponses)
def delete_folder(folder_id: int, session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    folder = session.execute(
        select(LibraryFolder).where(LibraryFolder.id == folder_id)
    ).scalar()
    if folder is None:
        raise VenusError.not_found()

    session.delete(folder)
    session.commit()

    return Response(status_code=HTTP_204_NO_CONTENT)
