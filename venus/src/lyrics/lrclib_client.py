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

import requests
from pydantic import BaseModel


class LrclibResponse(BaseModel):
    id: int
    name: str | None = None
    trackName: str | None = None
    artistName: str | None = None
    albumName: str | None = None
    duration: int | None = None
    instrumental: bool | None = None
    plainLyrics: str | None = None
    syncedLyrics: str | None = None


@dataclass
class LrclibGetRequest:
    track_name: str
    duration: int
    artist_name: str
    album_name: str | None = None


@dataclass
class LrclibLyrics:
    plain_lyrics: str | None = None
    synced_lyrics: str | None = None


def fetch_track_lyrics(request: LrclibGetRequest, api_url: str):
    params = {
        "duration": request.duration,
        "track_name": request.track_name,
        "artist_name": request.artist_name,
    }
    if request.album_name is not None:
        params["album_name"] = request.album_name

    r = requests.get(f"{api_url}/get", params=params)
    # TODO user agent

    try:
        json = r.json()
        response = LrclibResponse.model_validate(json)

        if response.plainLyrics is None and response.syncedLyrics is None:
            return None

        return LrclibLyrics(
            plain_lyrics=response.plainLyrics, synced_lyrics=response.syncedLyrics
        )
    except Exception:
        return None
