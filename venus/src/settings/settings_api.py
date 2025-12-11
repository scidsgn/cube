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

from src.settings.lyrics import lyrics_settings_api
from src.settings.musical_analysis import musical_analysis_settings_api
from src.settings.musicbrainz import mb_settings_api
from src.settings.scanning import scan_settings_api

router = APIRouter(prefix="/settings")

router.include_router(scan_settings_api.router)
router.include_router(lyrics_settings_api.router)
router.include_router(musical_analysis_settings_api.router)
router.include_router(mb_settings_api.router)
