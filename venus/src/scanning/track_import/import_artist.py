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

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from src.db.schema import Artist
from src.metadata.metadata_model import MetadataArtist


def get_existing(metadata_artist: MetadataArtist, session: Session) -> Artist | None:
    artist_q = select(Artist).where(
        func.lower(Artist.name) == metadata_artist.name.lower()
    )

    return session.execute(artist_q).scalar()


def update(metadata_artist: MetadataArtist, artist: Artist, session: Session):
    pass


def create(metadata_artist: MetadataArtist, session: Session) -> Artist:
    artist = Artist(name=metadata_artist.name)
    session.add(artist)

    return artist


def import_artist(metadata_artist: MetadataArtist, session: Session) -> Artist:
    artist = get_existing(metadata_artist, session)

    if artist is not None:
        update(metadata_artist, artist, session)
        session.flush()
        return artist

    artist = create(metadata_artist, session)

    session.flush()

    return artist
