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

from datetime import date

import musicbrainzngs
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.engine import engine
from src.db.schema import (
    AlbumMusicbrainzDetails,
    AlbumMusicbrainzLabel,
    AlbumMusicbrainzGenre,
    Album,
    DiscTrack,
)
from src.musicbrainz_old.entities import (
    get_or_create_mb_label,
    get_or_create_mb_genre,
)
from src.musicbrainz_old.lookup_track import lookup_musicbrainz_track
from src.musicbrainz_old.mb_utils import init_musicbrainz, list_or_empty
from src.redis.redis_queue import redis_queue


def lookup_musicbrainz_album(album_id: int, mbid: str):
    init_musicbrainz()

    try:
        with Session(engine) as session:
            album = session.execute(select(Album).where(Album.id == album_id)).scalar()
            if album is None:
                print("Album not found")
                return

            if album.mb_details and album.mb_details.mbid == mbid:
                print("No change!")
                return

            release = musicbrainzngs.get_release_by_id(
                mbid,
                includes=["recordings", "labels", "release-groups"],
            )

            release_group = musicbrainzngs.get_release_group_by_id(
                release["release"]["release-group"]["id"], includes=["tags"]
            )

            release_type = release["release"]["release-group"]["primary-type"]
            release_date = date.fromisoformat(release["release"]["date"])

            if album.mb_details:
                session.delete(album.mb_details)

            mb_details = AlbumMusicbrainzDetails(
                album=album,
                mbid=mbid,
                release_type=release_type,
                release_date=release_date,
            )
            session.add(mb_details)

            for index, label in enumerate(
                deduplicate_labels(list_or_empty(release["release"], "label-info-list"))
            ):
                mb_label = get_or_create_mb_label(
                    mbid=label["label"]["id"],
                    name=label["label"]["name"],
                    type=label["label"]["type"],
                    session=session,
                )
                session.add(
                    AlbumMusicbrainzLabel(
                        mb_details=mb_details, label=mb_label, order=index
                    )
                )

            for tag in list_or_empty(release_group["release-group"], "tag-list"):
                mb_genre = get_or_create_mb_genre(tag["name"], session)
                session.add(
                    AlbumMusicbrainzGenre(
                        mb_details=mb_details, genre=mb_genre, weight=tag["count"]
                    )
                )

            session.commit()

            disc_tracks = {disc.disc_number: disc.tracks for disc in album.discs}
            for medium in list_or_empty(release["release"], "medium-list"):
                position = int(medium["position"])
                track_count = int(medium["track-count"])

                if (
                    position in disc_tracks
                    and len(disc_tracks[position]) == track_count
                ):
                    tracks = [
                        track
                        for track in sorted(
                            disc_tracks[position], key=lambda t: t.order
                        )
                    ]
                    if not track_list_well_ordered(tracks):
                        continue

                    recording_ids = [
                        track["recording"]["id"]
                        for track in list_or_empty(medium, "track-list")
                    ]
                    for index, recording_id in enumerate(recording_ids):
                        track = tracks[index].track
                        redis_queue.enqueue(
                            lookup_musicbrainz_track, track.id, recording_id
                        )

    except Exception as e:
        # TODO: more proper
        print(e)


def track_list_well_ordered(track_list: list[DiscTrack]):
    for index, track in enumerate(track_list):
        expected_track_number = index + 1
        if expected_track_number != track.order:
            return False
    return True


def deduplicate_labels(labels):
    return list({label["label"]["id"]: label for label in labels}.values())
