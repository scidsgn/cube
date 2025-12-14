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

from fastapi import APIRouter
from sqlalchemy import select
from starlette.responses import Response
from starlette.status import HTTP_200_OK, HTTP_204_NO_CONTENT

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import Playlist, Track, PlaylistTrack
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses, VenusErrorCode
from src.error.venus_error import VenusError
from src.playlists.playlists_model import (
    PlaylistsResponse,
    PlaylistCreateRequest,
    PlaylistDto,
    PlaylistWithTracksDto,
    PlaylistAddTrackRequest, PlaylistReorderTracksRequest,
)

router = APIRouter(prefix="/playlists")


@router.get("", response_model=PlaylistsResponse, responses=VenusErrorResponses)
def get_playlists(session: SessionDep, _chamberlock: ChamberlockDep):
    playlists = session.execute(select(Playlist)).scalars()

    return PlaylistsResponse.from_entity(playlists=playlists)


@router.post("", response_model=PlaylistDto, responses=VenusErrorResponses)
def create_playlist(
    request: PlaylistCreateRequest, session: SessionDep, chamberlock: ChamberlockDep
):
    playlist = Playlist(
        author=chamberlock.user.userId,
        name=request.name,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    session.add(playlist)
    session.flush()

    playlist_dto = PlaylistDto.from_entity(playlist)
    session.commit()

    return playlist_dto


@router.get(
    "/{playlist_id}",
    response_model=PlaylistWithTracksDto,
    responses=VenusErrorResponses,
)
def get_playlist_by_id(
    playlist_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    playlist = session.execute(
        select(Playlist).where(Playlist.id == playlist_id)
    ).scalar()
    if playlist is None:
        raise VenusError.not_found()

    return PlaylistWithTracksDto.from_entity(playlist)


@router.post("/{playlist_id}/tracks", responses=VenusErrorResponses)
def add_track_to_playlist(
    playlist_id: int,
    request: PlaylistAddTrackRequest,
    session: SessionDep,
    chamberlock: ChamberlockDep,
):
    playlist = session.execute(
        select(Playlist).where(Playlist.id == playlist_id)
    ).scalar()
    if playlist is None:
        raise VenusError.not_found()
    if playlist.author != chamberlock.user.userId:
        raise VenusError.bad(VenusErrorCode.playlist_belongs_to_another_user)

    track = session.execute(select(Track).where(Track.id == request.track_id)).scalar()
    if track is None:
        raise VenusError.not_found()

    max_order = (
        max(track.order for track in playlist.tracks) if len(playlist.tracks) else 0
    )
    playlist_track = PlaylistTrack(playlist=playlist, track=track, order=max_order + 1)
    playlist.updated_at = datetime.now()

    session.add(playlist_track)
    session.commit()

    return Response(status_code=HTTP_200_OK)


@router.delete(
    "/{playlist_id}/tracks/{playlist_track_id}", responses=VenusErrorResponses
)
def delete_track_from_playlist(
    playlist_id: int,
    playlist_track_id: int,
    session: SessionDep,
    chamberlock: ChamberlockDep,
):
    playlist = session.execute(
        select(Playlist).where(Playlist.id == playlist_id)
    ).scalar()
    if playlist is None:
        raise VenusError.not_found()
    if playlist.author != chamberlock.user.userId:
        raise VenusError.bad(VenusErrorCode.playlist_belongs_to_another_user)

    playlist_track = session.execute(
        select(PlaylistTrack)
        .where(PlaylistTrack.playlist_id == playlist_id)
        .where(PlaylistTrack.id == playlist_track_id)
    ).scalar()
    if playlist_track is None:
        raise VenusError.not_found()

    session.delete(playlist_track)
    session.commit()

    return Response(status_code=HTTP_204_NO_CONTENT)

@router.post("/{playlist_id}/reorder", responses=VenusErrorResponses)
def reorder_playlist_tracks(playlist_id: int, request: PlaylistReorderTracksRequest, session: SessionDep, chamberlock: ChamberlockDep):
    playlist = session.execute(
        select(Playlist).where(Playlist.id == playlist_id)
    ).scalar()
    if playlist is None:
        raise VenusError.not_found()
    if playlist.author != chamberlock.user.userId:
        raise VenusError.bad(VenusErrorCode.playlist_belongs_to_another_user)

    if len(playlist.tracks) != len(request.track_ids):
        raise VenusError.bad(VenusErrorCode.playlist_length_mismatch)

    for track in playlist.tracks:
        try:
            order = request.track_ids.index(track.id)
            track.order = order
        except:
            raise VenusError.bad(VenusErrorCode.playlist_unknown_track, f"Did not find track ID {track.id}")

    session.commit()

    return Response(status_code=HTTP_200_OK)