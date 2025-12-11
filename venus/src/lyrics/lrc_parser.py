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

import re

from src.lyrics.lyrics_model import SyncedLyricsLine, SyncedLyrics

timed_line_pattern = re.compile("^(\\[\\d{2}:\\d{2}\\.\\d{2}]\\s*)+(.*)$")
timestamp_pattern = re.compile("\\[(\\d{2}):(\\d{2})\\.(\\d{2})]")


def parse_lrc(lrc: str, duration: float):
    timestamped_lines: list[tuple[float, str]] = []

    for line in lrc.splitlines():
        trimmed_line = line.strip()
        match = re.match(timed_line_pattern, trimmed_line)
        if match is None:
            continue

        timestamps = parse_timestamps(trimmed_line[0 : match.end(1)])
        lyric_line = match.group(2).strip()

        for timestamp in sorted(timestamps):
            timestamped_lines.append((timestamp, lyric_line))

    if len(timestamped_lines) == 0:
        return None

    if timestamped_lines[-1][1] != "":
        timestamped_lines.append((duration, ""))

    synced_lines: list[SyncedLyricsLine] = []

    for i, timestamped_line in enumerate(timestamped_lines):
        if i == len(timestamped_lines) - 1:
            break
        timestamp, line = timestamped_lines[i]

        if line == "":
            continue

        synced_lines.append(
            SyncedLyricsLine(
                start=timestamp, end=timestamped_lines[i + 1][0], line=line
            )
        )

    if len(synced_lines) == 0:
        return None

    return SyncedLyrics(lines=synced_lines)


def parse_timestamps(timestamps: str):
    matches = re.findall(timestamp_pattern, timestamps)
    if matches is None:
        return []

    return [timestamp_tuple_to_seconds(match) for match in matches]


def timestamp_tuple_to_seconds(timestamp: tuple[str, str, str]):
    return int(timestamp[0]) * 60 + int(timestamp[1]) + int(timestamp[2]) / 100
