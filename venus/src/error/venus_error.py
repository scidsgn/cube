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

from starlette.status import (
    HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_403_FORBIDDEN,
    HTTP_422_UNPROCESSABLE_CONTENT,
    HTTP_409_CONFLICT,
)

from src.error.error_model import VenusErrorCode


class VenusError(Exception):
    def __init__(self, code: VenusErrorCode, http_status: int, message: str):
        self.code = code
        self.http_status = http_status
        self.message = message

    @staticmethod
    def bad(code: VenusErrorCode, message: str = ""):
        return VenusError(code=code, http_status=HTTP_400_BAD_REQUEST, message=message)

    @staticmethod
    def not_found(
        code: VenusErrorCode = VenusErrorCode.entity_not_found, message: str = ""
    ):
        return VenusError(code=code, http_status=HTTP_404_NOT_FOUND, message=message)

    @staticmethod
    def bad_content(code: VenusErrorCode, message: str = ""):
        return VenusError(
            code=code, http_status=HTTP_422_UNPROCESSABLE_CONTENT, message=message
        )

    @staticmethod
    def unauthorized(
        code: VenusErrorCode = VenusErrorCode.unauthorized, message: str = ""
    ):
        return VenusError(code=code, http_status=HTTP_401_UNAUTHORIZED, message=message)

    @staticmethod
    def forbidden(code: VenusErrorCode, message: str = ""):
        return VenusError(code=code, http_status=HTTP_403_FORBIDDEN, message=message)

    @staticmethod
    def conflict(
        code: VenusErrorCode = VenusErrorCode.entity_already_exists, message: str = ""
    ):
        return VenusError(code=code, http_status=HTTP_409_CONFLICT, message=message)
