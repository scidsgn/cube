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

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.schema import LibraryFolder, Track
from pathlib import Path

from src.env import env
from src.scanning.scans.tracks_import_job.scan_audio_files import (
    scan_audio_files,
    ScannedFile,
)


@dataclass
class ScanFiles:
    files_to_upsert: list[ScannedFile]
    tracks_to_delete: list[Track]


def scan_library_folders(session: Session, reimport_all: bool):
    library_folders = session.execute(select(LibraryFolder)).scalars()

    folder_paths = validate_library_folders(list(library_folders), session)

    scanned_files = scan_audio_files(folder_paths)
    tracks = session.execute(select(Track)).scalars()

    scanned_files_map = {file.file_path: file for file in scanned_files}
    scanned_files_paths = set(scanned_files_map.keys())

    tracks_map = {file.file_path: file for file in tracks}
    tracks_paths = set(tracks_map.keys())

    new_paths = list(scanned_files_paths - tracks_paths)
    deleted_paths = list(tracks_paths - scanned_files_paths)

    existing_paths = scanned_files_paths & tracks_paths
    recently_modified_paths = [
        path
        for path in existing_paths
        if scanned_files_map[path].modified_at > tracks_map[path].modified_at
    ]

    if reimport_all:
        upsert_paths = new_paths + list(existing_paths)
    else:
        upsert_paths = new_paths + recently_modified_paths

    return ScanFiles(
        files_to_upsert=[scanned_files_map[path] for path in upsert_paths],
        tracks_to_delete=[tracks_map[path] for path in deleted_paths],
    )


def validate_library_folders(folders: list[LibraryFolder], session: Session):
    valid_folders: list[LibraryFolder] = []

    for folder in folders:
        path = Path(env.MEDIA_DRIVE) / folder.path

        if not path.exists():
            folder.invalid_reason = "Folder does not exist"
            continue
        if not path.is_dir():
            folder.invalid_reason = "Folder is not a directory"
            continue

        valid_folders.append(folder)
        folder.invalid_reason = ""

    session.commit()

    return valid_folders
