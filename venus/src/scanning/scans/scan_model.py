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

from pydantic import BaseModel

from src.db.schema import (
    Scan,
    OngoingOperationStatus,
    TracksImportJob,
    TrackMusicalEstimationJob,
    ScanStatus,
    TrackLyricsJob,
)


class ScanTracksImportDto(BaseModel):
    status: OngoingOperationStatus

    upserted_tracks: int
    deleted_tracks: int

    enqueued_at: datetime
    started_at: datetime | None
    ended_at: datetime | None

    @staticmethod
    def from_entity(job: TracksImportJob):
        return ScanTracksImportDto(
            status=job.status,
            upserted_tracks=job.upserted_tracks,
            deleted_tracks=job.deleted_tracks,
            enqueued_at=job.enqueued_at,
            started_at=job.started_at,
            ended_at=job.ended_at,
        )


class ScanTrackMusicalEstimationDto(BaseModel):
    status: OngoingOperationStatus

    file_path: str

    enqueued_at: datetime
    started_at: datetime | None
    ended_at: datetime | None

    @staticmethod
    def from_entity(job: TrackMusicalEstimationJob):
        return ScanTrackMusicalEstimationDto(
            status=job.status,
            file_path=job.track.file_path,
            enqueued_at=job.enqueued_at,
            started_at=job.started_at,
            ended_at=job.ended_at,
        )


class ScanTrackLyricsDto(BaseModel):
    status: OngoingOperationStatus

    file_path: str

    enqueued_at: datetime
    started_at: datetime | None
    ended_at: datetime | None

    @staticmethod
    def from_entity(job: TrackLyricsJob):
        return ScanTrackLyricsDto(
            status=job.status,
            file_path=job.track.file_path,
            enqueued_at=job.enqueued_at,
            started_at=job.started_at,
            ended_at=job.ended_at,
        )


class ScanDto(BaseModel):
    id: int
    status: ScanStatus
    enqueued_at: datetime
    started_at: datetime | None
    ended_at: datetime | None

    tracks_import: ScanTracksImportDto | None
    musical_estimations: list[ScanTrackMusicalEstimationDto] | None
    lyrics: list[ScanTrackLyricsDto] | None

    @staticmethod
    def from_entity(scan: Scan):
        return ScanDto(
            id=scan.id,
            status=scan.status,
            enqueued_at=scan.enqueued_at,
            started_at=scan.started_at,
            ended_at=scan.ended_at,
            tracks_import=ScanTracksImportDto.from_entity(scan.tracks_import_job)
            if scan.tracks_import_job
            else None,
            musical_estimations=[
                ScanTrackMusicalEstimationDto.from_entity(job)
                for job in scan.track_musical_estimation_jobs
            ]
            if len(scan.track_musical_estimation_jobs)
            else None,
            lyrics=[
                ScanTrackLyricsDto.from_entity(job) for job in scan.track_lyrics_jobs
            ]
            if len(scan.track_lyrics_jobs)
            else None,
        )


class ScansResponse(BaseModel):
    scans: list[ScanDto]
