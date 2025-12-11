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

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.schema import MusicbrainzLabel, MusicbrainzGenre


def get_or_create_mb_label(mbid: str, name: str, type: str, session: Session):
    mb_label = session.execute(
        select(MusicbrainzLabel).where(MusicbrainzLabel.mbid == mbid)
    ).scalar()
    if mb_label is not None:
        return mb_label

    mb_label = MusicbrainzLabel(mbid=mbid, name=name, type=type)
    session.add(mb_label)

    return mb_label


def get_or_create_mb_genre(name: str, session: Session):
    mb_genre = session.execute(
        select(MusicbrainzGenre).where(MusicbrainzGenre.name == name)
    ).scalar()
    if mb_genre is not None:
        return mb_genre

    mb_genre = MusicbrainzGenre(name=name)
    session.add(mb_genre)

    return mb_genre
