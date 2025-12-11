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
from datetime import datetime
from pathlib import Path

from src.db.schema import LibraryFolder
from src.env import env


@dataclass
class ScannedFile:
    file_path: str
    modified_at: datetime
    library_folder: LibraryFolder


def scan_audio_files(folders: list[LibraryFolder]):
    supported_extensions = [".mp3", ".ogg", ".wav", ".flac"]

    collected_files: list[ScannedFile] = []

    for folder in folders:
        folder_path = Path(env.MEDIA_DRIVE) / folder.path

        for path in Path(folder_path).rglob("*.*"):
            if path.suffix not in supported_extensions:
                continue

            modified_at = datetime.fromtimestamp(path.stat().st_mtime)
            collected_files.append(
                ScannedFile(file_path=str(path), modified_at=modified_at, library_folder=folder)
            )

    return collected_files
