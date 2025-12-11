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
from starlette.responses import FileResponse

from src.auth.chamberlock import ChamberlockDep
from src.db.schema import CoverArt
from src.db.session import SessionDep
from src.error.error_model import VenusErrorResponses
from src.error.venus_error import VenusError

router = APIRouter(prefix="/cover-arts")


@router.get("/{cover_art_id}", responses=VenusErrorResponses)
def get_cover_art(cover_art_id: int, session: SessionDep, _chamberlock: ChamberlockDep):
    cover_art = session.execute(
        select(CoverArt).where(CoverArt.id == cover_art_id)
    ).scalar()
    if cover_art is None:
        raise VenusError.not_found()

    return FileResponse(cover_art.path)
