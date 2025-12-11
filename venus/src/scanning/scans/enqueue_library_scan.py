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

from sqlalchemy.orm import Session

from src.db.schema import Scan, TracksImportJob, OngoingOperationStatus, ScanStatus
from src.scanning.scans.scan_model import ScanDto
from src.scanning.scans.tracks_import_job.tracks_import_job import (
    perform_tracks_import_job,
)
from src.redis.redis_queue import redis_queue


def enqueue_library_scan(session: Session):
    scan = Scan(
        status=ScanStatus.started,
        enqueued_at=datetime.now(),
        started_at=datetime.now(),
    )
    tracks_import_job = TracksImportJob(
        status=OngoingOperationStatus.enqueued,
        scan=scan,
        enqueued_at=datetime.now(),
        upserted_tracks=0,
        deleted_tracks=0,
    )

    session.add(scan)
    session.add(tracks_import_job)

    session.flush()

    scan_dto = ScanDto.from_entity(scan)
    session.commit()

    redis_queue.enqueue(perform_tracks_import_job, tracks_import_job.id)

    return scan_dto
