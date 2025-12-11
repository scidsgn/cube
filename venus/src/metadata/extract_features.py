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
from dataclasses import dataclass

from src.metadata.extract_settings import ExtractMetadataSettings
from src.metadata.split_artists import split_artists

title_features_pattern = re.compile(
    r"^(.+?)(\s+[(\[{]?(?:feat|ft)(?:\.?|uring)\s(.+?)[)\]}]?)?(\s+[(\[{](.+)\s+remix[)\]}])?$",
    re.IGNORECASE,
)


@dataclass
class FeaturesExtractResult:
    actual_value: str
    features: list[str]
    remixers: list[str]


def extract_features(title: str, settings: ExtractMetadataSettings):
    if not settings.extract_track_features:
        return FeaturesExtractResult(actual_value=title, features=[], remixers=[])

    matches = re.match(title_features_pattern, title)

    features = split_artists(matches[3], settings) if matches[3] else []
    remixers = split_artists(matches[5], settings) if matches[5] else []

    return FeaturesExtractResult(
        actual_value=matches[1], features=features, remixers=remixers
    )
