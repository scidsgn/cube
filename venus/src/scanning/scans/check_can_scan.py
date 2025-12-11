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

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.schema import Scan, OngoingOperationStatus, ScanStatus


def check_whether_can_scan(session: Session):
    unfinished_scans_q = select(Scan).where(
        Scan.status == ScanStatus.started
    )
    unfinished_scan = session.execute(unfinished_scans_q).scalar()
    if unfinished_scan is not None:
        return False

    return True
