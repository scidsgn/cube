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

import { NowPlayingBar } from "@/app/venus/now-playing/bar/now-playing-bar"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"
import {
    PlayerPlaybackState,
    usePlayer,
} from "@/app/venus/playback/player-context"
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

export const NowPlayingContainer = () => {
    const pathname = usePathname()
    const track = usePlaybackQueue((state) => state.currentTrack?.track)
    const { playbackState } = usePlayer()

    if (!track || playbackState === PlayerPlaybackState.stopped) {
        return null
    }

    return <NowPlayingBar track={track} />
}
