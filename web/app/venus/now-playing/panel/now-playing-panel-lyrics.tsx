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
import { Duration } from "@/app/components/text/duration"
import { fetchLyricsAction } from "@/app/venus/now-playing/panel/fetch-lyrics-action"
import { PlaybackBaseTrack } from "@/app/venus/playback/playback-queue-store"
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

type NowPlayingPanelLyricsProps = {
    track: PlaybackBaseTrack
}

export const NowPlayingPanelLyrics = ({
    track,
}: NowPlayingPanelLyricsProps) => {
    const { data } = useSWR(
        {
            type: "lyrics",
            trackId: track.id,
        },
        (key) => fetchLyricsAction(key.trackId),
    )

    if (!data || actionFailed(data)) {
        return (
            <div className="tracking-sm p-6 text-center text-sm font-medium text-gray-400">
                No lyrics found
            </div>
        )
    }

    const lyrics = data.data

    if (lyrics.synced_lyrics) {
        return (
            <div className="flex flex-col gap-1">
                {lyrics.synced_lyrics.lines.map((line, i) => (
                    <div key={i} className="">
                        <span className="tracking-sm text-sm font-medium text-gray-400">
                            <Duration>{line.start}</Duration>
                        </span>
                        <p className="text-xl font-medium">{line.line}</p>
                    </div>
                ))}
            </div>
        )
    }

    if (lyrics.plain_lyrics) {
        return (
            <div className="flex flex-col gap-1">
                {lyrics.plain_lyrics.split("\n").map((line, i) => (
                    <p key={i} className="text-xl font-medium">
                        {line}
                    </p>
                ))}
            </div>
        )
    }
}
