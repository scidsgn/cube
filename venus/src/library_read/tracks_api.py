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
from src.db.schema import Track
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError
from src.library_read.track_model import (
    TracksResponse,
    TrackDto,
    TrackWaveformDto,
    TrackLyricsDto,
)

router = APIRouter(prefix="/tracks")


@router.get("", response_model=TracksResponse, responses=VenusErrorResponses)
def get_tracks(session: SessionDep, _chamberlock: ChamberlockDep):
    tracks = session.execute(select(Track)).scalars()

    return TracksResponse(tracks=[TrackDto.from_entity(track) for track in tracks])


@router.get("/{track_id}", response_model=TrackDto, responses=VenusErrorResponses)
def get_track(track_id: int, session: SessionDep, _chamberlock: ChamberlockDep):
    track = session.execute(select(Track).where(Track.id == track_id)).scalar()
    if track is None:
        raise VenusError.not_found()

    return TrackDto.from_entity(track)


@router.get("/{track_id}/streams/original", responses=VenusErrorResponses)
def get_track_original_stream(
    track_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    track = session.execute(select(Track).where(Track.id == track_id)).scalar()
    if track is None:
        raise VenusError.not_found()

    return FileResponse(track.file_path)


@router.get(
    "/{track_id}/waveform",
    response_model=TrackWaveformDto,
    responses=VenusErrorResponses,
)
def get_track_waveform(
    track_id: int, session: SessionDep, _chamberlock: ChamberlockDep
):
    track = session.execute(select(Track).where(Track.id == track_id)).scalar()
    if track is None:
        raise VenusError.not_found()
    if track.musical_features is None:
        raise VenusError.not_found()

    waveform_bytes = [byte for byte in track.musical_features.waveform]

    return TrackWaveformDto(waveform=waveform_bytes)


@router.get(
    "/{track_id}/lyrics", response_model=TrackLyricsDto, responses=VenusErrorResponses
)
def get_track_lyrics(track_id: int, session: SessionDep, _chamberlock: ChamberlockDep):
    track = session.execute(select(Track).where(Track.id == track_id)).scalar()
    if track is None:
        raise VenusError.not_found()
    if track.lyrics is None:
        raise VenusError.not_found()

    try:
        return TrackLyricsDto.from_entity(track.lyrics)
    except Exception:
        raise VenusError.not_found()
