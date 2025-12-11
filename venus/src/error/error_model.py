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

from enum import Enum, auto

from pydantic import BaseModel
from starlette.status import (
    HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_422_UNPROCESSABLE_CONTENT,
    HTTP_409_CONFLICT,
)


class VenusErrorCode(Enum):
    def _generate_next_value_(name, start, count, last_values):
        return name.upper()

    # Generic errors
    entity_not_found = auto()
    entity_already_exists = auto()
    unauthorized = auto()

    # Upload errors
    file_too_large = auto()
    could_not_upload_file = auto()

    # Scanning errors
    scan_already_ongoing = auto()
    no_ongoing_scan = auto()

    # Folders
    invalid_folder_path = auto()
    path_already_covered = auto()
    path_is_superset = auto()
    path_is_root = auto()

    # Playlists
    playlist_belongs_to_another_user = auto()


class VenusErrorResponse(BaseModel):
    code: VenusErrorCode
    message: str


VenusErrorResponses = {
    HTTP_400_BAD_REQUEST: {"model": VenusErrorResponse},
    HTTP_401_UNAUTHORIZED: {"model": VenusErrorResponse},
    HTTP_403_FORBIDDEN: {"model": VenusErrorResponse},
    HTTP_404_NOT_FOUND: {"model": VenusErrorResponse},
    HTTP_409_CONFLICT: {"model": VenusErrorResponse},
    HTTP_422_UNPROCESSABLE_CONTENT: {"model": VenusErrorResponse},
}
