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

from dataclasses import dataclass

import librosa
import numpy as np
from scipy.stats import zscore
from scipy.linalg import norm, circulant


@dataclass
class MusicalAnalysisResult:
    bpm: float
    key: str
    scale: str
    waveform_bytes: bytes


keys = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"]

major_key_profile = np.asarray(
    [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
)
minor_key_profile = np.asarray(
    [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]
)


def generate_key_profile_options(key_profile):
    scores = zscore(key_profile)
    profile_norm = norm(scores)
    profile_options = circulant(scores)

    return profile_norm, profile_options


major_key_norm, major_key_options = generate_key_profile_options(major_key_profile)
minor_key_norm, minor_key_options = generate_key_profile_options(minor_key_profile)


def rms_to_waveform_bytes(rms) -> bytes:
    window = 200
    averaged_rms = [
        np.mean(rms[i * window : (i + 1) * window])
        for i in range(int(len(rms) / window))
    ]
    max_rms = max(averaged_rms)
    max_rms = 1 if max_rms == 0 else max_rms

    byte_array = [int((value / max_rms) * 255) for value in averaged_rms]

    return bytes(byte_array)


def analyze_track(file_path: str) -> MusicalAnalysisResult | None:
    try:
        y, sr = librosa.load(file_path, sr=None)

        chromagram = librosa.feature.chroma_stft(y=y, sr=sr)
        mean_chroma = np.mean(chromagram, axis=1)

        onset_env = librosa.onset.onset_strength(y=y, sr=sr, aggregate=np.median)
        tempo, beats_static = librosa.beat.beat_track(
            onset_envelope=onset_env,
            sr=sr,
            units="time",
            hop_length=512,
            start_bpm=120,
            tightness=100,
        )

        note_scores = zscore(mean_chroma)
        note_norm = norm(note_scores)

        correlations_major = (
            major_key_options.T.dot(note_scores) / major_key_norm / note_norm
        )
        correlations_minor = (
            minor_key_options.T.dot(note_scores) / minor_key_norm / note_norm
        )

        rms = librosa.feature.rms(y=y)
        waveform_bytes = rms_to_waveform_bytes((np.power(10, rms) - 1)[0])

        key_correlations = {
            (key, "major"): float(correlations_major[index])
            for index, key in enumerate(keys)
        } | {
            (key, "minor"): float(correlations_minor[index])
            for index, key in enumerate(keys)
        }

        key, scale = max(key_correlations, key=key_correlations.get)

        return MusicalAnalysisResult(
            bpm=float(tempo[0]),
            key=key,
            scale=scale,
            waveform_bytes=waveform_bytes,
        )
    except Exception:
        return None
