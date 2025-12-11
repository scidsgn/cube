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
from typing import TypeVar, Callable

from sqlalchemy.orm import Session

from src.db.schema import (
    TracksImportJob,
    TrackMusicalEstimationJob,
    OngoingOperationStatus,
    ScanStatus,
    TrackLyricsJob,
)

Job = TracksImportJob | TrackMusicalEstimationJob | TrackLyricsJob

TJob = TypeVar("TJob", bound="Job")


def perform_job(session: Session, job: TJob, runner: Callable[[], None]):
    if guard_skip(job):
        print(f"Job {job.id} skipped")
        return

    mark_job_started(job)
    session.commit()

    try:
        runner()

        mark_job_completed(job)
        print(f"Job {job.id} completed at {job.ended_at}")
        session.commit()
    except Exception as e:
        mark_job_failed(job)
        print(f"Job {job.id} failed: {e}")
        session.commit()


def mark_job_started(job: Job):
    job.started_at = datetime.now()
    job.status = OngoingOperationStatus.started


def mark_job_completed(job: Job):
    job.ended_at = datetime.now()
    job.status = OngoingOperationStatus.completed


def mark_job_failed(job: Job):
    job.ended_at = datetime.now()
    job.status = OngoingOperationStatus.failed


def guard_skip(job: Job):
    if (
        job.status == OngoingOperationStatus.skipped
        or job.scan.status == ScanStatus.interrupted
    ):
        return True

    return False


def is_job_status_terminal(status: OngoingOperationStatus) -> bool:
    return (
        status == OngoingOperationStatus.failed
        or status == OngoingOperationStatus.completed
        or status == OngoingOperationStatus.skipped
    )
