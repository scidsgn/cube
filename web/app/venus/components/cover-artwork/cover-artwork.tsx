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

"use client"

import { CoverArtDto } from "@/apis/venus"

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

type CoverArtworkProps = {
    size: number
    artwork: CoverArtDto | null
    alt: string
}

export const CoverArtwork = ({ size, artwork, alt }: CoverArtworkProps) => {
    return (
        <div
            className="shrink-0 bg-gray-900"
            style={{ width: size, height: size }}
        >
            {artwork && (
                <img
                    className="object-cover"
                    width={size}
                    height={size}
                    src={`/venus/api/cover-arts/${artwork.id}`}
                    alt={alt}
                    style={{ width: size, height: size }}
                />
            )}
        </div>
    )
}
