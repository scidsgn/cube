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
    MusicalAnalysisSettings,
    MusicalAnalysisLevel,
    Track,
    TrackMusicalEstimationJob,
    OngoingOperationStatus,
)
from src.redis.redis_queue import redis_queue
from src.scanning.scans.track_musical_features_job.track_musical_features_job import (
    perform_track_musical_features_job,
)


def enqueue_musical_features_jobs_if_needed(session: Session, scan: Scan):
    musical_analysis_settings = session.execute(
        select(MusicalAnalysisSettings)
    ).scalar()
    if musical_analysis_settings is None:
        print("Musical estimation settings not found")
        return

    if musical_analysis_settings.level == MusicalAnalysisLevel.none:
        clean_outdated_musical_features(session)
    else:
        enqueue_musical_features_jobs(session, scan)


def enqueue_musical_features_jobs(session: Session, scan: Scan):
    for track in session.execute(select(Track)).scalars():
        if (
            track.musical_features is not None
            and track.modified_at <= track.musical_features.modified_at
        ):
            continue

        estimation_job = TrackMusicalEstimationJob(
            status=OngoingOperationStatus.enqueued,
            scan=scan,
            enqueued_at=datetime.now(),
            track=track,
        )
        session.add(estimation_job)
        session.flush()

        redis_queue.enqueue(perform_track_musical_features_job, estimation_job.id)


def clean_outdated_musical_features(session: Session):
    for track in session.execute(select(Track)).scalars():
        if track.musical_features is None:
            continue

        if track.modified_at > track.musical_features.modified_at:
            session.delete(track.musical_features)
