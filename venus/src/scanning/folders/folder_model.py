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

from pydantic import BaseModel

from src.db.schema import LibraryFolder


class FolderDto(BaseModel):
    id: int
    path: str
    invalid_reason: str
    track_count: int

    @staticmethod
    def from_entity(folder: LibraryFolder):
        return FolderDto(
            id=folder.id,
            path=folder.path,
            invalid_reason=folder.invalid_reason,
            track_count=len(folder.tracks),
        )


class FoldersResponse(BaseModel):
    folders: list[FolderDto]

    @staticmethod
    def from_entity(folders: list[LibraryFolder]):
        return FoldersResponse(
            folders=[FolderDto.from_entity(folder) for folder in folders]
        )


class FolderAddRequest(BaseModel):
    path: str
