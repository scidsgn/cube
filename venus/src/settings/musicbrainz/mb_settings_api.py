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
from src.db.schema import MusicbrainzFetchSettings
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError
from src.settings.musicbrainz.mb_settings_model import (
    MusicbrainzSettingsDto,
    MusicbrainzSettingsUpdateRequest,
)

router = APIRouter(prefix="/musicbrainz")


@router.get("", response_model=MusicbrainzSettingsDto, responses=VenusErrorResponses)
def get_musicbrainz_settings(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    mb_fetch_settings = session.execute(select(MusicbrainzFetchSettings)).scalar()
    if mb_fetch_settings is None:
        raise VenusError.not_found()

    return MusicbrainzSettingsDto.from_entity(mb_fetch_settings)


@router.patch("", response_model=MusicbrainzSettingsDto, responses=VenusErrorResponses)
def update_musicbrainz_settings(
    request: MusicbrainzSettingsUpdateRequest,
    session: SessionDep,
    chamberlock: ChamberlockDep,
):
    chamberlock.ensure_admin()

    mb_fetch_settings = session.execute(select(MusicbrainzFetchSettings)).scalar()
    if mb_fetch_settings is None:
        raise VenusError.not_found()

    if request.fetch_data is not None:
        mb_fetch_settings.fetch_musicbrainz_data = request.fetch_data
    if request.mb_api_hostname is not None:
        mb_fetch_settings.musicbrainz_hostname = request.mb_api_hostname

    session.commit()

    return MusicbrainzSettingsDto.from_entity(mb_fetch_settings)
