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

import os

import dotenv
from pydantic import BaseModel

dotenv.load_dotenv()


class EnvVars(BaseModel):
    PORT: int

    MEDIA_DRIVE: str
    INDEX_FOLDER: str

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_DB: str

    JWT_PUBLIC_KEY_PATH: str
    JWT_ISSUER: str

    REDIS_HOSTNAME: str
    REDIS_PORT: int


class EnvSecrets(BaseModel):
    jwtPublicKey: str


def read_secret(path: str):
    with open(path) as f:
        return f.read().strip()


env = EnvVars(**os.environ)
secrets = EnvSecrets(
    jwtPublicKey=read_secret(env.JWT_PUBLIC_KEY_PATH),
)
