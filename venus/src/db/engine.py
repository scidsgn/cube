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

from sqlalchemy import create_engine

from src.db.schema import Base
from src.env import env

pg_user = env.POSTGRES_USER
pg_password = env.POSTGRES_PASSWORD
pg_host = env.POSTGRES_HOST
pg_database = env.POSTGRES_DB

connection_string = (
    f"postgresql+psycopg://{pg_user}:{pg_password}@{pg_host}/{pg_database}"
)

engine = create_engine(connection_string, echo=False)


def create_tables():
    Base.metadata.create_all(engine)
