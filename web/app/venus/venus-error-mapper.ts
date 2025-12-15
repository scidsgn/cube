/*
 * CUBE
 * Copyright (C) 2025  scidsgn
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { VenusErrorCode } from "@/apis/venus"

export function venusErrorMapper(code: VenusErrorCode) {
    const mappings: Record<VenusErrorCode, string> = {
        COULD_NOT_UPLOAD_FILE: "Could not upload file",
        ENTITY_ALREADY_EXISTS: "Already exists",
        ENTITY_NOT_FOUND: "Not found",
        FILE_TOO_LARGE: "Provided file is too large",
        INVALID_FOLDER_PATH: "Provided folder path was invalid",
        NO_ONGOING_SCAN: "No scans in progress",
        SCAN_ALREADY_ONGOING: "There is already a scan in progress",
        UNAUTHORIZED: "Unauthorized",
        PATH_ALREADY_COVERED: "Folder contents already set to be imported",
        PATH_IS_ROOT: "Cannot declare media root as import folder",
        PATH_IS_SUPERSET: "Some folders inside already set to be imported", // TODO this could be a thing where the user could ask to remove those subfolders and import the whole folder instead,
        PLAYLIST_BELONGS_TO_ANOTHER_USER:
            "Cannot make changes to a playlist belonging to another user",
        PLAYLIST_LENGTH_MISMATCH:
            "Provided track set doesn't match amount of tracks in the playlist", // TODO very technical, shouldn't happen
        PLAYLIST_UNKNOWN_TRACK: "Unknown playlist track",
    }

    return mappings[code]
}
