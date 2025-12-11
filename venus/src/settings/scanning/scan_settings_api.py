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

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import LibraryScanSettings
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError
from src.settings.scanning.scan_settings_model import (
    ScanSettingsDto,
    ScanSettingsUpdateRequest,
)

router = APIRouter(prefix="/scanning")


@router.get("", response_model=ScanSettingsDto, responses=VenusErrorResponses)
def get_scan_settings(session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    library_scan_settings = session.execute(select(LibraryScanSettings)).scalar()
    if library_scan_settings is None:
        raise VenusError.not_found()

    return ScanSettingsDto.from_entity(library_scan_settings)


@router.patch("", response_model=ScanSettingsDto, responses=VenusErrorResponses)
def update_scan_settings(request: ScanSettingsUpdateRequest, session: SessionDep, chamberlock: ChamberlockDep):
    chamberlock.ensure_admin()

    library_scan_settings = session.execute(select(LibraryScanSettings)).scalar()
    if library_scan_settings is None:
        raise VenusError.not_found()

    changes_made = False

    if request.extract_track_features is not None:
        library_scan_settings.extract_track_features = request.extract_track_features
        changes_made = True
    if request.split_artists is not None:
        library_scan_settings.split_artists = request.split_artists
        changes_made = True

    if changes_made:
        library_scan_settings.updated_at = datetime.now()

    session.commit()

    return ScanSettingsDto.from_entity(library_scan_settings)
