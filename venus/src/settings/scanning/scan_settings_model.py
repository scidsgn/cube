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

from src.db.schema import LibraryScanSettings


class ScanSettingsDto(BaseModel):
    extract_track_features: bool
    split_artists: bool

    @staticmethod
    def from_entity(settings: LibraryScanSettings):
        return ScanSettingsDto(
            extract_track_features=settings.extract_track_features,
            split_artists=settings.split_artists,
        )


class ScanSettingsUpdateRequest(BaseModel):
    extract_track_features: bool | None = None
    split_artists: bool | None = None
