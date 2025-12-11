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

from typing import Annotated, Literal
from uuid import UUID

import jwt
from fastapi import Depends, Header
from pydantic import BaseModel

from src.env import env, secrets
from src.error.venus_error import VenusError

jwt_key = secrets.jwtPublicKey
jwt_issuer = env.JWT_ISSUER


class ChamberlockPayload(BaseModel):
    sub: UUID
    role: Literal["ADMIN", "MEMBER"]


class ChamberlockUser(BaseModel):
    userId: UUID
    role: Literal["ADMIN", "MEMBER"]


class Chamberlock:
    def __init__(
        self,
        authorization: Annotated[str | None, Header()] = None,
    ):
        if authorization is None or not authorization.startswith("Bearer "):
            raise VenusError.unauthorized()

        auth_token = authorization[len("Bearer ") :].strip()
        try:
            payload = jwt.decode(
                auth_token, jwt_key, algorithms=["RS512"], issuer=jwt_issuer
            )
            validated_payload = ChamberlockPayload.model_validate(payload)

            self.user = ChamberlockUser(
                userId=validated_payload.sub, role=validated_payload.role
            )
        except Exception:
            raise VenusError.unauthorized()

    def ensure_admin(self):
        if self.user.role != "ADMIN":
            raise VenusError.unauthorized()


ChamberlockDep = Annotated[Chamberlock, Depends(Chamberlock)]
