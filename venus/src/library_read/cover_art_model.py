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

from src.db.schema import CoverArt, Track


class CoverArtDto(BaseModel):
    id: int
    accent_color: str

    @staticmethod
    def from_entity(cover_art: CoverArt):
        return CoverArtDto(id=cover_art.id, accent_color=cover_art.accent_color)


def resolve_track_artwork(track: Track) -> CoverArtDto | None:
    if track.disc_track is not None:
        if track.disc_track.disc.album.artwork:
            return CoverArtDto.from_entity(track.disc_track.disc.album.artwork)

    if track.artwork:
        return CoverArtDto.from_entity(track.artwork)

    return None
