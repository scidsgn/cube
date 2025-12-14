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
from typing import Iterable
from uuid import UUID

from pydantic import BaseModel

from src.db.schema import Playlist, PlaylistTrack
from src.library_read.track_model import TrackDto


class PlaylistTrackDto(BaseModel):
    id: int
    track: TrackDto

    @staticmethod
    def from_entity(track: PlaylistTrack):
        return PlaylistTrackDto(
            id=track.id,
            track=TrackDto.from_entity(track.track),
        )


class PlaylistWithTracksDto(BaseModel):
    id: int
    name: str
    author: UUID
    created_at: datetime
    updated_at: datetime

    playlist_tracks: list[PlaylistTrackDto]

    @staticmethod
    def from_entity(playlist: Playlist):
        return PlaylistWithTracksDto(
            id=playlist.id,
            name=playlist.name,
            author=playlist.author,
            created_at=playlist.created_at,
            updated_at=playlist.updated_at,
            playlist_tracks=[
                PlaylistTrackDto.from_entity(track)
                for track in sorted(playlist.tracks, key=lambda t: t.order)
            ],
        )


class PlaylistDto(BaseModel):
    id: int
    name: str
    author: UUID
    created_at: datetime
    updated_at: datetime

    track_count: int

    @staticmethod
    def from_entity(playlist: Playlist):
        return PlaylistDto(
            id=playlist.id,
            name=playlist.name,
            author=playlist.author,
            created_at=playlist.created_at,
            updated_at=playlist.updated_at,
            track_count=len(playlist.tracks),
        )


class PlaylistsResponse(BaseModel):
    playlists: list[PlaylistDto]

    @staticmethod
    def from_entity(playlists: Iterable[Playlist]):
        return PlaylistsResponse(
            playlists=[PlaylistDto.from_entity(playlist) for playlist in playlists]
        )


class PlaylistCreateRequest(BaseModel):
    name: str


class PlaylistAddTrackRequest(BaseModel):
    track_id: int

class PlaylistReorderTracksRequest(BaseModel):
    track_ids: list[int]