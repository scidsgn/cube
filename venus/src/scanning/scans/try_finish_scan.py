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

from src.db.schema import Scan, OngoingOperationStatus, ScanStatus

from sqlalchemy.orm import Session
from src.db.engine import engine
from src.scanning.scans.job_utils import is_job_status_terminal


def try_finish_scan(scan_id: int):
    with Session(engine) as session:
        scan: Scan | None = session.execute(
            select(Scan).where(Scan.id == scan_id)
        ).scalar()
        if not scan:
            return

        if scan.status == ScanStatus.interrupted:
            return

        job_statuses: list[OngoingOperationStatus] = []

        tracks_import_job = scan.tracks_import_job
        if tracks_import_job:
            job_statuses.append(tracks_import_job.status)

        for track_musical_estimation_job in scan.track_musical_estimation_jobs:
            job_statuses.append(track_musical_estimation_job.status)

        if len(job_statuses) == 0:
            return

        if not all(is_job_status_terminal(status) for status in job_statuses):
            return

        scan.status = (
            ScanStatus.failed
            if OngoingOperationStatus.failed in job_statuses
            else ScanStatus.completed
        )
        scan.ended_at = datetime.now()

        session.commit()
