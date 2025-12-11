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

from src.db.schema import Album, AlbumArtist
from src.scanning.track_import.import_artist import import_artist
from src.scanning.track_import.import_cover_art import import_cover_art
from src.metadata.metadata_model import MetadataAlbum


def get_existing(metadata_album: MetadataAlbum, session: Session) -> Album | None:
    existing_albums = session.execute(
        select(Album).where(Album.title == metadata_album.title)
    ).scalars()

    metadata_artist_names = tuple(
        artist.name.lower() for artist in metadata_album.artists
    )

    for existing_album in existing_albums:
        artist_names = tuple(
            album_artist.artist.name.lower()
            for album_artist in sorted(existing_album.artists, key=lambda a: a.order)
        )

        if artist_names == metadata_artist_names:
            return existing_album

    return None


def update(metadata_album: MetadataAlbum, album: Album, session: Session):
    album.release_year = metadata_album.release_year

    if metadata_album.artwork is None and album.artwork is not None:
        album.artwork_id = None

    if metadata_album.artwork is not None:
        cover_art = import_cover_art(metadata_album.artwork, session)
        album.artwork = cover_art


def create(metadata_album: MetadataAlbum, session: Session) -> Album:
    album = Album(title=metadata_album.title, release_year=metadata_album.release_year)
    session.add(album)

    if metadata_album.artwork is not None:
        cover_art = import_cover_art(metadata_album.artwork, session)
        album.artwork = cover_art

    for order, artist in enumerate(metadata_album.artists):
        album_artist = AlbumArtist(
            album=album, artist=import_artist(artist, session), order=order
        )
        session.add(album_artist)

    return album


def import_album(metadata_album: MetadataAlbum, session: Session) -> Album:
    album = get_existing(metadata_album, session)

    if album is not None:
        update(metadata_album, album, session)
        session.flush()
        return album

    album = create(metadata_album, session)

    session.flush()

    return album
