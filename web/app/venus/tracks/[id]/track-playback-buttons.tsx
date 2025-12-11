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

import { TrackDto } from "@/apis/venus"
import { Button } from "@/app/components/button/button"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"

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

type TrackPlaybackButtonsProps = {
    track: TrackDto
}

export const TrackPlaybackButtons = ({ track }: TrackPlaybackButtonsProps) => {
    const currentTrack = usePlaybackQueue((state) => state.currentTrack?.track)
    const playTrack = usePlaybackQueue((state) => state.playTrack)
    const enqueue = usePlaybackQueue((state) => state.enqueue)

    return (
        <>
            <Button
                variant="accent"
                size="lg"
                icon="play_arrow"
                onClick={() => playTrack(track)}
                disabled={currentTrack?.id === track.id}
            >
                {currentTrack?.id === track.id ? "Playing" : "Play"}
            </Button>
            <Button
                size="lg"
                icon="playlist_add"
                onClick={() => enqueue([track])}
            />
        </>
    )
}
