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
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.engine import engine
from src.db.schema import (
    Scan,
    ScanStatus,
    LibraryScanSettings,
    MusicalAnalysisLevel,
    LyricsFetchSettings,
    MusicalAnalysisSettings,
    MusicbrainzFetchSettings,
)
from src.env import env
from src.redis.redis_queue import redis_queue


def startup_sequence():
    covers_path = Path(env.INDEX_FOLDER) / "covers"
    if not covers_path.exists():
        covers_path.mkdir()

    with Session(engine) as session:
        redis_queue.empty()

        unfinished_scans_q = select(Scan).where(Scan.status == ScanStatus.started)
        for scan in session.execute(unfinished_scans_q).scalars():
            scan.status = ScanStatus.failed

        library_scan_settings = session.execute(select(LibraryScanSettings)).scalar()
        if library_scan_settings is None:
            library_scan_settings = LibraryScanSettings(
                extract_track_features=False,
                split_artists=False,
                updated_at=datetime.now(),
            )
            session.add(library_scan_settings)

        musical_analysis_settings = session.execute(
            select(MusicalAnalysisSettings)
        ).scalar()
        if musical_analysis_settings is None:
            musical_analysis_settings = MusicalAnalysisSettings(
                level=MusicalAnalysisLevel.none
            )
            session.add(musical_analysis_settings)

        lyrics_fetch_settings = session.execute(select(LyricsFetchSettings)).scalar()
        if lyrics_fetch_settings is None:
            lyrics_fetch_settings = LyricsFetchSettings(
                fetch_lyrics=False,
                lrclib_api_url="https://lrclib.net/api",
            )
            session.add(lyrics_fetch_settings)

        mb_fetch_settings = session.execute(select(MusicbrainzFetchSettings)).scalar()
        if mb_fetch_settings is None:
            mb_fetch_settings = MusicbrainzFetchSettings(
                fetch_musicbrainz_data=False,
                musicbrainz_hostname="beta.musicbrainz.org",
            )
            session.add(mb_fetch_settings)

        session.commit()
