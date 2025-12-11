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
from src.db.schema import MusicalAnalysisSettings
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError
from src.settings.musical_analysis.musical_analysis_settings_model import (
    MusicalAnalysisSettingsDto,
    MusicalAnalysisSettingsUpdateRequest,
)

router = APIRouter(prefix="/musical_analysis")


@router.get(
    "", response_model=MusicalAnalysisSettingsDto, responses=VenusErrorResponses
)
def get_musical_analysis_settings(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    musical_estimation_settings = session.execute(
        select(MusicalAnalysisSettings)
    ).scalar()
    if musical_estimation_settings is None:
        raise VenusError.not_found()

    return MusicalAnalysisSettingsDto.from_entity(musical_estimation_settings)


@router.patch(
    "", response_model=MusicalAnalysisSettingsDto, responses=VenusErrorResponses
)
def update_musical_analysis_settings(
    request: MusicalAnalysisSettingsUpdateRequest,
    session: SessionDep,
    chamberlock: ChamberlockDep,
):
    chamberlock.ensure_admin()

    musical_analysis_settings = session.execute(
        select(MusicalAnalysisSettings)
    ).scalar()
    if musical_analysis_settings is None:
        raise VenusError.not_found()

    if request.level is not None:
        musical_analysis_settings.level = request.level

    session.commit()

    return MusicalAnalysisSettingsDto.from_entity(musical_analysis_settings)
