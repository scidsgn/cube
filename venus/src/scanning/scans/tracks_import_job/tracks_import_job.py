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
from src.db.schema import (
    TracksImportJob,
    NoSplitEntry,
    LibraryScanSettings,
    Track,
    Scan,
)
from src.metadata.extract_settings import ExtractMetadataSettings
from src.scanning.scans.job_utils import perform_job
from src.scanning.scans.track_lyrics_job.enqueue_track_lyrics_jobs import (
    enqueue_track_lyrics_jobs_if_needed,
)
from src.scanning.scans.track_musical_features_job.enqeue_musical_features_jobs import (
    enqueue_musical_features_jobs_if_needed,
)
from src.scanning.scans.tracks_import_job.cleanup_stray_entities import (
    cleanup_stray_entities,
)
from src.scanning.scans.tracks_import_job.scan_library_folders import (
    scan_library_folders,
)
from src.scanning.scans.try_finish_scan import try_finish_scan
from src.metadata.extract_metadata import extract_metadata_from_file
from src.scanning.track_import.import_track import import_track
from src.redis.redis_queue import redis_queue


def perform_tracks_import_job(job_id: int):
    with Session(engine) as session:
        job: TracksImportJob | None = session.execute(
            select(TracksImportJob).where(TracksImportJob.id == job_id)
        ).scalar()
        if job is None:
            print(f"Job {job_id} not found")
            return

        def perform():
            # TODO force rescan everything if scan settings changed
            library_scan_settings = session.execute(
                select(LibraryScanSettings)
            ).scalar()
            if not library_scan_settings:
                print("Library scan settings not found")
                raise Exception("Library scan settings not found")

            no_split_entries = session.execute(select(NoSplitEntry)).scalars()
            no_split_list = [entry.name for entry in no_split_entries]

            extract_metadata_settings = ExtractMetadataSettings(
                extract_track_features=library_scan_settings.extract_track_features,
                split_artists=library_scan_settings.split_artists,
                no_split_list=no_split_list,
            )

            should_reimport_all = False

            previous_scan: Scan | None = session.execute(
                select(Scan).order_by(Scan.enqueued_at.desc()).limit(1).offset(1)
            ).scalar()
            if previous_scan is not None:
                if library_scan_settings.updated_at > previous_scan.ended_at:
                    should_reimport_all = True

            scan_files = scan_library_folders(session, should_reimport_all)

            # upsert
            upserted_tracks = 0
            upserted_track_entities: list[Track] = []
            for file_to_add in scan_files.files_to_upsert:
                print(f"Inspecting file {file_to_add}")
                metadata_track = extract_metadata_from_file(
                    file_to_add.file_path, extract_metadata_settings
                )
                if metadata_track is None:
                    continue
                track = import_track(
                    metadata_track,
                    None,
                    file_to_add.library_folder,
                    file_to_add.modified_at,
                    session,
                )
                print(f"Imported file {file_to_add}")

                upserted_tracks += 1
                upserted_track_entities.append(track)

            # delete
            deleted_tracks = 0
            for track_to_delete in scan_files.tracks_to_delete:
                print(f"Deleting file {track_to_delete.file_path}")
                session.delete(track_to_delete)
                deleted_tracks += 1

            cleanup_stray_entities(session)

            job.upserted_tracks = upserted_tracks
            job.deleted_tracks = deleted_tracks
            session.commit()

            enqueue_musical_features_jobs_if_needed(session, job.scan)
            enqueue_track_lyrics_jobs_if_needed(session, job.scan)

            session.commit()

        perform_job(session, job, perform)

        redis_queue.enqueue(try_finish_scan, job.scan_id)
