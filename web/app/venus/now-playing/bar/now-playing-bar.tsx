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

import { AccentProvider } from "@/app/components/accent/accent-provider"
import { NowPlayingMini } from "@/app/venus/now-playing/bar/now-playing-mini"
import { useNowPlaying } from "@/app/venus/now-playing/now-playing-store"
import { PlaybackBaseTrack } from "@/app/venus/playback/playback-queue-store"

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

type NowPlayingBarProps = {
    track: PlaybackBaseTrack
}

export const NowPlayingBar = ({ track }: NowPlayingBarProps) => {
    const expanded = useNowPlaying((state) => state.expanded)
    const setExpanded = useNowPlaying((state) => state.setExpanded)

    if (expanded) {
        return null
    }

    return (
        <AccentProvider color={track?.artwork?.accent_color}>
            <div className="relative h-9 w-88 bg-black">
                <NowPlayingMini
                    track={track}
                    onExpand={() => setExpanded(true)}
                />
            </div>
        </AccentProvider>
    )
}
