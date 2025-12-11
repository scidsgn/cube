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
from sqlalchemy import select

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import LyricsFetchSettings
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError
from src.settings.lyrics.lyrics_settings_model import (
    LyricsSettingsDto,
    LyricsSettingsUpdateRequest,
)

router = APIRouter(prefix="/lyrics")


@router.get("", response_model=LyricsSettingsDto, responses=VenusErrorResponses)
def get_lyrics_settings(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    lyrics_fetch_settings = session.execute(select(LyricsFetchSettings)).scalar()
    if lyrics_fetch_settings is None:
        raise VenusError.not_found()

    return LyricsSettingsDto.from_entity(lyrics_fetch_settings)


@router.patch("", response_model=LyricsSettingsDto, responses=VenusErrorResponses)
def update_lyrics_settings(
    request: LyricsSettingsUpdateRequest,
    session: SessionDep,
    chamberlock: ChamberlockDep,
):
    chamberlock.ensure_admin()

    lyrics_fetch_settings = session.execute(select(LyricsFetchSettings)).scalar()
    if lyrics_fetch_settings is None:
        raise VenusError.not_found()

    if request.fetch_lyrics is not None:
        lyrics_fetch_settings.fetch_lyrics = request.fetch_lyrics
    if request.lrclib_api_url is not None:
        lyrics_fetch_settings.lrclib_api_url = request.lrclib_api_url

    session.commit()

    return LyricsSettingsDto.from_entity(lyrics_fetch_settings)
