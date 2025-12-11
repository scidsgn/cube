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

from src.db.schema import Disc
from src.library_read.album_model import AlbumDto


class DiscDto(BaseModel):
    id: int
    disc_number: int
    track_count: int

    album: AlbumDto

    @staticmethod
    def from_entity(disc: Disc):
        return DiscDto(
            id=disc.id,
            disc_number=disc.disc_number,
            album=AlbumDto.from_entity(disc.album),
            track_count=len(disc.tracks),
        )


class DiscsResponse(BaseModel):
    discs: list[DiscDto]

    @staticmethod
    def from_entity(discs: list[Disc]):
        return DiscsResponse.from_entity(discs)


class DiscTrackDto(BaseModel):
    disc: DiscDto
    track_number: int
