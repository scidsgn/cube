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

export type TracklistColumn = "artists" | "album" | "tempo" | "key"

export function tracklistColumnsToGridTemplate(columns: TracklistColumn[]) {
    const columnWidths: Record<TracklistColumn, string> = {
        artists: "1fr",
        album: "1fr",
        tempo: "100px",
        key: "100px",
    }

    return columns.map((column) => columnWidths[column]).join(" ")
}
