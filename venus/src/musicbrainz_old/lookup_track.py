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

import musicbrainzngs
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.engine import engine
from src.db.schema import (
    Track,
    TrackMusicbrainzDetails,
    TrackMusicbrainzGenre,
    TrackMusicbrainzProductionCredit,
    TrackMusicbrainzWritingCredit,
)
from src.scanning.track_import.import_artist import import_artist
from src.metadata.metadata_model import MetadataArtist
from src.musicbrainz_old.entities import get_or_create_mb_genre
from src.musicbrainz_old.mb_utils import init_musicbrainz, list_or_empty
from src.musicbrainz_old.track_credits import (
    gather_artist_credits,
    gather_writing_credits,
)


def lookup_musicbrainz_track(track_id: int, mbid: str):
    init_musicbrainz()

    try:
        with Session(engine) as session:
            track = session.execute(select(Track).where(Track.id == track_id)).scalar()
            if track is None:
                print("Track not found")
                return

            if track.mb_details and track.mb_details.mbid == mbid:
                print("No change!")
                return

            recording = musicbrainzngs.get_recording_by_id(
                mbid,
                includes=["tags", "artist-rels", "work-rels"],
            )

            if track.mb_details:
                session.delete(track.mb_details)

            mb_details = TrackMusicbrainzDetails(
                track=track,
                mbid=mbid,
            )
            session.add(mb_details)

            for tag in list_or_empty(recording["recording"], "tag-list"):
                mb_genre = get_or_create_mb_genre(tag["name"], session)
                session.add(
                    TrackMusicbrainzGenre(mb_details=mb_details, genre=mb_genre)
                )

            artist_rels = list_or_empty(recording["recording"], "artist-relation-list")
            for credit in gather_artist_credits(artist_rels):
                artist_entity = import_artist(
                    MetadataArtist(name=credit.artist_name), session
                )

                session.add(
                    TrackMusicbrainzProductionCredit(
                        mb_details=mb_details,
                        artist=artist_entity,
                        type=credit.type,
                        description=credit.description,
                    )
                )

            work_id = next(
                (
                    work_relation["work"]["id"]
                    for work_relation in list_or_empty(
                        recording["recording"], "work-relation-list"
                    )
                    if work_relation["type"] == "performance"
                ),
                None,
            )
            if work_id is not None:
                work = musicbrainzngs.get_work_by_id(work_id, includes=["artist-rels"])
                work_artist_rels = list_or_empty(work["work"], "artist-relation-list")

                for credit in gather_writing_credits(work_artist_rels):
                    artist_entity = import_artist(
                        MetadataArtist(name=credit.artist_name), session
                    )

                    session.add(
                        TrackMusicbrainzWritingCredit(
                            mb_details=mb_details,
                            artist=artist_entity,
                        )
                    )

            session.commit()

    except Exception as e:
        # TODO: more proper
        print(e)
