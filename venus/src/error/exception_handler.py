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

from starlette.responses import PlainTextResponse

from src.error.error_model import VenusErrorResponse
from src.error.venus_error import VenusError


def handle_venus_error(exc: VenusError):
    response = VenusErrorResponse(code=exc.code, message=exc.message)
    return PlainTextResponse(
        response.model_dump_json(),
        status_code=exc.http_status,
        media_type="application/json",
    )
