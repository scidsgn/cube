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

from fastapi import APIRouter
from fastapi.responses import FileResponse
from sqlalchemy import select

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import Album, Disc
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError
from src.library_read.album_model import AlbumsResponse, AlbumWithDetailsDto
from src.library_read.track_model import (
    TrackDto,
    TracksResponse,
)
from src.library_read.disc_model import DiscDto, DiscsResponse

router = APIRouter(prefix="/albums")


@router.get("", response_model=AlbumsResponse, responses=VenusErrorResponses)
def get_albums(session: SessionDep, _chamberlock: ChamberlockDep):
    albums = session.execute(select(Album)).scalars()

    return AlbumsResponse.from_entity(albums)


@router.get(
    "/{album_id}",
    response_model=AlbumWithDetailsDto,
    responses=VenusErrorResponses,
)
def get_album(album_id: int, session: SessionDep, _chamberlock: ChamberlockDep):
    album = session.execute(select(Album).where(Album.id == album_id)).scalar()
    if album is None:
        raise VenusError.not_found()

    return AlbumWithDetailsDto.from_entity(album)


@router.get(
    "/{album_id}/discs",
    response_model=DiscsResponse,
    responses=VenusErrorResponses,
)
def get_album_discs(album_id: int, session: SessionDep, _chamberlock: ChamberlockDep):
    album = session.execute(select(Album).where(Album.id == album_id)).scalar()
    if album is None:
        raise VenusError.not_found()

    return DiscsResponse(
        discs=[
            DiscDto.from_entity(disc)
            for disc in sorted(album.discs, key=lambda d: d.disc_number)
        ]
    )


@router.get(
    "/{album_id}/discs/{disc_id}",
    response_model=DiscDto,
    responses=VenusErrorResponses,
)
def get_album_disc(
    album_id: int, disc_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    disc = session.execute(
        select(Disc).where(Disc.id == disc_id, Disc.album_id == album_id)
    ).scalar()
    if disc is None:
        raise VenusError.not_found()

    return DiscDto.from_entity(disc)


@router.get(
    "/{album_id}/discs/{disc_id}/tracks",
    response_model=TracksResponse,
    responses=VenusErrorResponses,
)
def get_album_disc_tracks(
    album_id: int, disc_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    disc = session.execute(
        select(Disc).where(Disc.id == disc_id, Disc.album_id == album_id)
    ).scalar()
    if disc is None:
        raise VenusError.not_found()

    return TracksResponse(
        tracks=[
            TrackDto.from_entity(track.track)
            for track in sorted(disc.tracks, key=lambda t: t.order)
        ]
    )


@router.get("/{album_id}/artwork", responses=VenusErrorResponses)
def get_album_artwork(album_id: int, session: SessionDep, _chamberlock: ChamberlockDep):
    album = session.execute(select(Album).where(Album.id == album_id)).scalar()
    if album is None:
        raise VenusError.not_found()

    if album.artwork is None:
        raise VenusError.not_found()

    return FileResponse(album.artwork.path)
