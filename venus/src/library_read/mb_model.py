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

from src.db.schema import MusicbrainzLabel, MusicbrainzGenre


class MusicbrainzLabelDto(BaseModel):
    mbid: str
    name: str
    type: str

    @staticmethod
    def from_entity(mb_label: MusicbrainzLabel):
        return MusicbrainzLabelDto(
            mbid=mb_label.mbid, name=mb_label.name, type=mb_label.type
        )


class MusicbrainzGenreDto(BaseModel):
    name: str

    @staticmethod
    def from_entity(mb_genre: MusicbrainzGenre):
        return MusicbrainzGenreDto(name=mb_genre.name)
