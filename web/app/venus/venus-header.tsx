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

import { LinkButton } from "@/app/components/button/button"
import { usePathname } from "next/navigation"

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

export const VenusHeader = () => {
    const pathname = usePathname()

    return (
        <>
            <LinkButton
                variant={
                    pathname.startsWith("/venus/artists")
                        ? "dark"
                        : "transparent"
                }
                icon="person_2"
                href="/venus/artists"
            >
                Artists
            </LinkButton>
            <LinkButton
                variant={
                    pathname.startsWith("/venus/albums")
                        ? "dark"
                        : "transparent"
                }
                icon="library_music"
                href="/venus/albums"
            >
                Albums
            </LinkButton>
            <LinkButton
                variant={
                    pathname.startsWith("/venus/playlists")
                        ? "dark"
                        : "transparent"
                }
                icon="featured_play_list"
                href="/venus/playlists"
            >
                Playlists
            </LinkButton>
        </>
    )
}
