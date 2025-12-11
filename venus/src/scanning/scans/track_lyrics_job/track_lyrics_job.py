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

from time import sleep

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.engine import engine
from src.db.schema import TrackLyricsJob, Track, LyricsFetchSettings
from src.lyrics.fetch_lyrics import fetch_lyrics_for_track
from src.redis.redis_queue import redis_queue
from src.scanning.scans.job_utils import perform_job
from src.scanning.scans.try_finish_scan import try_finish_scan


def perform_track_lyrics_job(job_id: int):
    with Session(engine) as session:
        job: TrackLyricsJob | None = session.execute(
            select(TrackLyricsJob).where(TrackLyricsJob.id == job_id)
        ).scalar()
        if job is None:
            print(f"Job {job_id} not found")
            return

        def perform():
            lyrics_fetch_settings = session.execute(
                select(LyricsFetchSettings)
            ).scalar()
            if lyrics_fetch_settings is None:
                print("Lyrics fetch settings not found")
                raise Exception("Library fetch settings not found")

            track: Track = job.track

            sleep(4)  # TODO for now

            fetch_lyrics_for_track(track, session, lyrics_fetch_settings.lrclib_api_url)
            session.commit()

        perform_job(session, job, perform)

        redis_queue.enqueue(try_finish_scan, job.scan_id)
