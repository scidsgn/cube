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

from src.db.schema import Scan, ScanStatus, OngoingOperationStatus
from src.redis.redis_queue import redis_queue


def try_interrupt_scan(session: Session):
    unfinished_scans_q = select(Scan).where(Scan.status == ScanStatus.started)
    unfinished_scan: Scan | None = session.execute(unfinished_scans_q).scalar()
    if unfinished_scan is None:
        return

    unfinished_scan.status = ScanStatus.interrupted
    unfinished_scan.ended_at = datetime.now()

    tracks_import_job = unfinished_scan.tracks_import_job
    if tracks_import_job is not None:
        if tracks_import_job.status == OngoingOperationStatus.enqueued:
            tracks_import_job.status = OngoingOperationStatus.skipped

    for job in unfinished_scan.track_musical_estimation_jobs:
        if job.status == OngoingOperationStatus.enqueued:
            job.status = OngoingOperationStatus.skipped

    session.commit()

    redis_queue.empty()
