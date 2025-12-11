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
import { Button } from "@/app/components/button/button"
import { TrackCoverArtwork } from "@/app/venus/components/cover-artwork/track-cover-artwork"
import {
    PlaybackQueueEntry,
    usePlaybackQueue,
} from "@/app/venus/playback/playback-queue-store"

type NowPlayingQueueEntryProps = {
    entry: PlaybackQueueEntry
}

export const NowPlayingQueueEntry = ({ entry }: NowPlayingQueueEntryProps) => {
    const goToEntry = usePlaybackQueue((state) => state.goToEntry)
    const removeEntry = usePlaybackQueue((state) => state.removeEntry)

    return (
        <div className="flex min-w-0 items-center gap-3">
            <div className="relative size-9">
                <TrackCoverArtwork size={36} track={entry.track} />
                <Button
                    className="absolute inset-0 opacity-0 hover:opacity-100 active:opacity-100"
                    icon="play_arrow"
                    variant="accent"
                    onClick={() => goToEntry(entry)}
                />
            </div>
            <span className="grow truncate text-sm font-medium">
                {entry.track.title}
            </span>

            <div className="flex">
                <Button
                    icon="remove"
                    variant="transparent"
                    onClick={() => removeEntry(entry)}
                />
            </div>
        </div>
    )
}
