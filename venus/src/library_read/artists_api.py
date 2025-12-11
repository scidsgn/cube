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

from io import BytesIO

from PIL import Image
from fastapi import APIRouter, UploadFile
from sqlalchemy import select

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import Artist
from src.db.session import SessionDep
from src.error.error_model import VenusErrorCode, VenusErrorResponses
from src.error.venus_error import VenusError
from src.scanning.track_import.import_cover_art import import_cover_art_bare
from src.library_read.album_model import AlbumsResponse
from src.library_read.artist_model import (
    ArtistsResponse,
    ArtistWithDetailsDto,
)
from src.library_read.track_model import (
    TracksResponse,
    TrackDto,
)

router = APIRouter(prefix="/artists")


@router.get("", response_model=ArtistsResponse, responses=VenusErrorResponses)
def get_artists(session: SessionDep, _chamberlock: ChamberlockDep):
    artists = session.execute(select(Artist)).scalars()

    return ArtistsResponse.from_entity(artists)


@router.get(
    "/{artist_id}", response_model=ArtistWithDetailsDto, responses=VenusErrorResponses
)
def get_artist(artist_id: int, session: SessionDep, _chamberlock: ChamberlockDep):
    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    return ArtistWithDetailsDto.from_entity(artist)


@router.post("/{artist_id}/cover-art", responses=VenusErrorResponses)
def put_artist_cover_art(
    artist_id: int, file: UploadFile, session: SessionDep, _chamberlock: ChamberlockDep
):
    _chamberlock.ensure_admin()

    if file.size > 10 * 1024 * 1024:
        raise VenusError.bad_content(VenusErrorCode.file_too_large)

    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    try:
        file_data = file.file.read()
        image = Image.open(BytesIO(file_data))

        cover_art = import_cover_art_bare(
            artwork_data=file_data, artwork_image=image, session=session
        )

        artist.artwork = cover_art

        session.commit()

        return "k"
    except Exception:
        raise VenusError.bad(VenusErrorCode.could_not_upload_file)


@router.get(
    "/{artist_id}/albums", response_model=AlbumsResponse, responses=VenusErrorResponses
)
def get_artist_albums(
    artist_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    return AlbumsResponse.from_entity([album.album for album in artist.albums])


@router.get(
    "/{artist_id}/tracks", response_model=TracksResponse, responses=VenusErrorResponses
)
def get_artist_tracks(
    artist_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    return TracksResponse(
        tracks=[TrackDto.from_entity(track.track) for track in artist.artist_tracks]
    )


@router.get(
    "/{artist_id}/writing_credits",
    response_model=TracksResponse,
    responses=VenusErrorResponses,
)
def get_artist_writing_credits(
    artist_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    return TracksResponse(
        tracks=[
            TrackDto.from_entity(credit.mb_details.track)
            for credit in artist.writing_credits
        ]
    )


@router.get(
    "/{artist_id}/production_credits",
    response_model=TracksResponse,
    responses=VenusErrorResponses,
)
def get_artist_production_credits(
    artist_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    return TracksResponse(
        tracks=[
            TrackDto.from_entity(credit.mb_details.track)
            for credit in artist.production_credits
        ]
    )


@router.get(
    "/{artist_id}/features",
    response_model=TracksResponse,
    responses=VenusErrorResponses,
)
def get_artist_features(
    artist_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    return TracksResponse(
        tracks=[TrackDto.from_entity(track.track) for track in artist.artist_features]
    )


@router.get(
    "/{artist_id}/remixes", response_model=TracksResponse, responses=VenusErrorResponses
)
def get_artist_remixes(
    artist_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    artist = session.execute(select(Artist).where(Artist.id == artist_id)).scalar()
    if artist is None:
        raise VenusError.not_found()

    return TracksResponse(
        tracks=[TrackDto.from_entity(track.track) for track in artist.artist_remixes]
    )
