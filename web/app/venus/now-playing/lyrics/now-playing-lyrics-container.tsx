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

import { actionFailed } from "@/app/action/action"
import { NowPlayingLyrics } from "@/app/venus/now-playing/lyrics/now-playing-lyrics"
import { fetchLyricsAction } from "@/app/venus/now-playing/panel/fetch-lyrics-action"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"
import useSWR from "swr"

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

export const NowPlayingLyricsContainer = () => {
    const track = usePlaybackQueue((state) => state.currentTrack)

    const { data } = useSWR(
        track
            ? {
                  type: "now_playing_lyrics",
                  trackId: track.track.id,
              }
            : null,
        (key) => fetchLyricsAction(key.trackId),
    )

    const lyrics = data && !actionFailed(data) && data.data?.synced_lyrics
    if (!lyrics) {
        return null
    }

    return <NowPlayingLyrics lyrics={lyrics} />
}
