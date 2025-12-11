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

from src.db.engine import engine
from src.db.schema import TrackMusicalEstimationJob, Track
from src.analysis.musical_analysis import analyze_track
from src.scanning.scans.job_utils import perform_job
from src.scanning.scans.try_finish_scan import try_finish_scan
from src.scanning.track_import.import_musical_features import import_musical_features
from src.redis.redis_queue import redis_queue


def perform_track_musical_features_job(job_id: int):
    with Session(engine) as session:
        job: TrackMusicalEstimationJob | None = session.execute(
            select(TrackMusicalEstimationJob).where(
                TrackMusicalEstimationJob.id == job_id
            )
        ).scalar()
        if job is None:
            print(f"Job {job_id} not found")
            return

        def perform():
            track: Track = job.track

            analysis_result = analyze_track(track.file_path)
            import_musical_features(track, analysis_result, session)
            session.commit()

        perform_job(session, job, perform)

        redis_queue.enqueue(try_finish_scan, job.scan_id)
