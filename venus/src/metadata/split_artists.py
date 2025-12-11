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

import itertools
import re

from src.metadata.extract_settings import ExtractMetadataSettings


def split_artists(artists: str, settings: ExtractMetadataSettings):
    if not settings.split_artists:
        return [artists]

    artist_lists = [
        split_artists_regex(artists) if should_split else [artists]
        for artists, should_split in split_into_segments(artists, settings.no_split_list)
    ]
    artists = itertools.chain(*artist_lists)

    return list(artist for artist in artists if artist)


def split_into_segments(artists: str, no_split_list: list[str]):
    if len(no_split_list) == 0:
        return [(artists, True)]

    splitter = "|".join(re.escape(item) for item in no_split_list)

    result = re.finditer(splitter, artists, re.RegexFlag.IGNORECASE)
    spans = [match.span() for match in result]

    if len(spans) == 0:
        return [(artists, True)]

    segments = []

    for index, span in enumerate(spans):
        if index == 0:
            segments.append((artists[0 : span[0]], True))
        else:
            segments.append((artists[spans[index - 1][1] : span[0]], True))

        segments.append((artists[span[0] : span[1]], False))

        if index == len(spans) - 1:
            segments.append((artists[span[1] :], True))
        else:
            segments.append((artists[span[1] : spans[index + 1][0]], True))

    return segments


def split_artists_regex(artists: str):
    return [artist.strip() for artist in re.split(r"[,&]", artists)]
