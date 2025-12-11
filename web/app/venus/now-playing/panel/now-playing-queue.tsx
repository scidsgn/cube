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
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { TrackCoverArtwork } from "@/app/venus/components/cover-artwork/track-cover-artwork"
import { NowPlayingQueueEntry } from "@/app/venus/now-playing/panel/now-playing-queue-entry"
import {
    PlaybackBaseTrack,
    usePlaybackQueue,
} from "@/app/venus/playback/playback-queue-store"

type NowPlayingQueueProps = {
    track: PlaybackBaseTrack
}

export const NowPlayingQueue = ({ track }: NowPlayingQueueProps) => {
    const history = usePlaybackQueue((state) => state.history)
    const upNext = usePlaybackQueue((state) => state.upNext)

    return (
        <div className="flex flex-col gap-2">
            {history.map((entry) => (
                <NowPlayingQueueEntry key={entry.id} entry={entry} />
            ))}

            <div className="bg-accent-950 flex min-w-0 items-center gap-3">
                <div className="relative size-9">
                    <TrackCoverArtwork size={36} track={track} />
                </div>
                <span className="grow truncate text-sm font-medium">
                    {track.title}
                </span>

                <div className="text-accent-500 grid size-9 place-items-center">
                    <IconSymbol icon="graphic_eq" size={20} />
                </div>
            </div>

            {upNext.map((entry) => (
                <NowPlayingQueueEntry key={entry.id} entry={entry} />
            ))}
        </div>
    )
}
