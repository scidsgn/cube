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

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.schema import (
    Scan,
    Track,
    TrackLyricsJob,
    OngoingOperationStatus,
    LyricsFetchSettings,
)
from src.lyrics.fetch_lyrics import make_lyrics_key
from src.redis.redis_queue import redis_queue
from src.scanning.scans.track_lyrics_job.track_lyrics_job import (
    perform_track_lyrics_job,
)


def enqueue_track_lyrics_jobs_if_needed(session: Session, scan: Scan):
    lyrics_fetch_settings = session.execute(select(LyricsFetchSettings)).scalar()
    if lyrics_fetch_settings is None:
        print("Lyrics fetch settings not found")
        return

    if lyrics_fetch_settings.fetch_lyrics:
        enqueue_lyrics_jobs(session, scan)
    else:
        clean_outdated_lyrics(session)


def enqueue_lyrics_jobs(session: Session, scan: Scan):
    for track in session.execute(select(Track)).scalars():
        key = make_lyrics_key(track)

        if track.lyrics is not None and track.lyrics.key == key:
            continue

        lyrics_job = TrackLyricsJob(
            status=OngoingOperationStatus.enqueued,
            scan=scan,
            enqueued_at=datetime.now(),
            track=track,
        )
        session.add(lyrics_job)
        session.flush()

        redis_queue.enqueue(perform_track_lyrics_job, lyrics_job.id)


def clean_outdated_lyrics(session: Session):
    for track in session.execute(select(Track)).scalars():
        if track.lyrics is None:
            continue

        key = make_lyrics_key(track)

        if track.lyrics.key != key:
            session.delete(track.lyrics)
