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

from src.db.schema import Track, TrackLyrics
from src.lyrics.lrc_parser import parse_lrc
from src.lyrics.lrclib_client import LrclibGetRequest, fetch_track_lyrics


def fetch_lyrics_for_track(track: Track, session: Session, api_url: str):
    if track.lyrics is not None:
        session.delete(track.lyrics)

    request = LrclibGetRequest(
        track_name=track.title,
        artist_name=", ".join(artist.artist.name for artist in track.artists),
        album_name=track.disc_track.disc.album.title if track.disc_track else None,
        duration=int(track.duration),
    )
    found_lyrics = fetch_track_lyrics(request, api_url)

    if found_lyrics is None:
        track.lyrics = None
        return

    track_lyrics = TrackLyrics(
        track=track, key=make_lyrics_key(track), plain_lyrics=found_lyrics.plain_lyrics
    )

    if found_lyrics.synced_lyrics is not None:
        synced_lyrics = parse_lrc(found_lyrics.synced_lyrics, track.duration)

        if synced_lyrics is not None:
            synced_lyrics_json = synced_lyrics.model_dump_json()
            track_lyrics.synced_lyrics = synced_lyrics_json

    session.add(track_lyrics)


def make_lyrics_key(track: Track):
    artist_names = "\t".join(artist.artist.name.lower() for artist in track.artists)
    title = track.title.lower()

    return f"{artist_names}\n\n{title}"
