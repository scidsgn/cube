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

from fastapi.routing import APIRoute

from src.env import env

import uvicorn
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware

from src.error.exception_handler import handle_venus_error
from src.error.venus_error import VenusError
from src.metadata import metadata_api
from src.playlists import playlists_api
from src.scanning import scanning_api
from src.settings import settings_api
from src.startup import (
    startup_sequence,
)
from src.library_read import library_api

from src.db.engine import create_tables


async def lifespan(app: FastAPI):
    create_tables()
    startup_sequence()
    yield


app = FastAPI(lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])


app.include_router(scanning_api.router)
app.include_router(library_api.router)
app.include_router(metadata_api.router)
app.include_router(settings_api.router)
app.include_router(playlists_api.router)


@app.exception_handler(VenusError)
def venus_error_handler(_request: Request, exc: VenusError):
    return handle_venus_error(exc)


for route in app.routes:
    if isinstance(route, APIRoute):
        route: APIRoute = route
        route.operation_id = f"venus_{route.name}"


def main():
    uvicorn.run("src.main:app", host="0.0.0.0", port=env.PORT)
