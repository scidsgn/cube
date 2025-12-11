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

import { AlbumWithDetailsDto } from "@/apis/venus"
import { Button } from "@/app/components/button/button"
import { Dropdown } from "@/app/components/menu/dropdown"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"
import { useMemo } from "react"

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

type AlbumPlaybackButtonsProps = {
    album: AlbumWithDetailsDto
}

export const AlbumPlaybackButtons = ({ album }: AlbumPlaybackButtonsProps) => {
    const playTracks = usePlaybackQueue((state) => state.playTracks)
    const enqueue = usePlaybackQueue((state) => state.enqueue)

    const albumTracks = useMemo(
        () => album.discs.flatMap((disc) => disc.tracks),
        [album],
    )

    return (
        <div className="flex">
            <div className="flex gap-1">
                <Button
                    variant="accent"
                    size="lg"
                    icon="play_arrow"
                    onClick={() => playTracks(albumTracks, null, false)}
                >
                    Play
                </Button>
                <Button
                    size="lg"
                    icon="shuffle"
                    onClick={() => playTracks(albumTracks, null, true)}
                />
            </div>

            <div className="grow" />

            <Dropdown
                size="lg"
                variant="transparent"
                icon="more_horiz"
                menu={[
                    {
                        type: "item",
                        icon: "playlist_add",
                        name: "Add to queue",
                        onClick: () => enqueue(albumTracks),
                    },
                ]}
            />
        </div>
    )
}
