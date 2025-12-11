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

from sqlalchemy.orm import Session

from src.db.schema import Track, TrackMusicalFeatures
from src.analysis.musical_analysis import MusicalAnalysisResult


camelot_major_keys = ["B", "F#", "C#", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E"]
camelot_minor_keys = ["Ab", "Eb", "Bb", "F", "C", "G", "D", "A", "E", "B", "F#", "C#"]


def import_musical_features(
    track: Track, analysis_result: MusicalAnalysisResult | None, session: Session
):
    if analysis_result is None:
        if track.musical_features is not None:
            session.delete(track.musical_features)
        return

    if track.musical_features is None:
        musical_features = TrackMusicalFeatures(
            track=track,
            modified_at=track.modified_at,
            bpm=analysis_result.bpm,
            key=analysis_result.key,
            scale=analysis_result.scale,
            camelot_index=camelot_major_keys.index(analysis_result.key) + 1
            if analysis_result.scale == "major"
            else camelot_minor_keys.index(analysis_result.key) + 1,
            waveform=analysis_result.waveform_bytes,
        )
        session.add(musical_features)
        return

    track.musical_features.bpm = analysis_result.bpm
    track.musical_features.key = analysis_result.key
    track.musical_features.scale = analysis_result.scale
    track.musical_features.camelot_index = (
        camelot_major_keys.index(analysis_result.key) + 1
        if analysis_result.scale == "major"
        else camelot_minor_keys.index(analysis_result.key) + 1
    )
    track.musical_features.waveform = analysis_result.waveform_bytes
