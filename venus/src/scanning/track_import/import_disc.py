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

from src.db.schema import Disc, Album
from src.scanning.track_import.import_album import import_album
from src.metadata.metadata_model import MetadataDisc


def get_existing(
    metadata_disc: MetadataDisc, album: Album, session: Session
) -> Disc | None:
    disc_q = select(Disc).where(
        Disc.album_id == album.id, Disc.disc_number == metadata_disc.disc_number
    )

    return session.execute(disc_q).scalar()


def create(metadata_disc: MetadataDisc, album: Album, session: Session) -> Disc:
    disc = Disc(album=album, disc_number=metadata_disc.disc_number)
    session.add(disc)

    return disc


def import_disc(metadata_disc: MetadataDisc, session: Session) -> Disc:
    album = import_album(metadata_disc.album, session)

    disc = get_existing(metadata_disc, album, session)
    if disc is not None:
        return disc

    disc = create(metadata_disc, album, session)
    session.flush()

    return disc
