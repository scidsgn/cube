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

from src.db.schema import Disc, Album, Artist


def cleanup_stray_entities(session: Session):
    empty_discs_q = select(Disc).where(~Disc.tracks.any())
    for empty_disc in session.execute(empty_discs_q).scalars():
        session.delete(empty_disc)

    session.flush()

    empty_albums_q = select(Album).where(~Album.discs.any())
    for empty_album in session.execute(empty_albums_q).scalars():
        session.delete(empty_album)

    session.flush()

    empty_artist_q = select(Artist).where(
        ~Artist.artist_tracks.any(),
        ~Artist.artist_features.any(),
        ~Artist.artist_remixes.any(),
        ~Artist.albums.any(),
        ~Artist.writing_credits.any(),
        ~Artist.production_credits.any(),
    )
    for empty_artist in session.execute(empty_artist_q).scalars():
        session.delete(empty_artist)
