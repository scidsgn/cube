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
import { Duration } from "@/app/components/text/duration"
import { cx } from "@/app/cva.config"
import { TrackCoverArtwork } from "@/app/venus/components/cover-artwork/track-cover-artwork"
import { NowPlayingNextButton } from "@/app/venus/now-playing/transport/now-playing-next-button"
import { NowPlayingPlayButton } from "@/app/venus/now-playing/transport/now-playing-play-button"
import {
    PlaybackBaseTrack,
    usePlaybackQueue,
} from "@/app/venus/playback/playback-queue-store"
import { usePlayer } from "@/app/venus/playback/player-context"
import { usePlaybackSettings } from "@/app/venus/playback/playback-settings-store"

type NowPlayingMiniProps = {
    track: PlaybackBaseTrack
    onExpand: () => void
}

export const NowPlayingMini = ({ track, onExpand }: NowPlayingMiniProps) => {
    const { currentTime, loop } = usePlayer()
    const shuffle = usePlaybackQueue((state) => state.shuffle)
    const muted = usePlaybackSettings((state) => state.muted)

    return (
        <div
            className={cx(
                "absolute top-0 right-0 left-0 flex h-9 w-full max-w-full min-w-0 items-center transition-opacity",
            )}
        >
            <button
                className="flex min-w-0 grow cursor-pointer items-center gap-1 text-left hover:bg-gray-50/8 active:bg-gray-50/15"
                onClick={(): void => onExpand()}
            >
                <TrackCoverArtwork size={36} track={track} />

                <span className="truncate pl-2 text-sm font-medium">
                    {track.title}
                </span>

                {loop ? (
                    <IconSymbol
                        className="text-accent-500"
                        size={20}
                        icon="repeat_one"
                    />
                ) : shuffle ? (
                    <IconSymbol
                        className="text-accent-500"
                        size={20}
                        icon="shuffle"
                    />
                ) : null}
                {muted && (
                    <IconSymbol
                        className="text-accent-500"
                        size={20}
                        icon="volume_off"
                    />
                )}

                <div className="grow" />

                <div className="flex shrink-0 flex-col items-end pr-2 font-mono text-xs leading-3 font-medium text-gray-500">
                    <span className="text-gray-200">
                        <Duration>{currentTime}</Duration>
                    </span>
                    <span>
                        <Duration>{track.duration}</Duration>
                    </span>
                </div>
            </button>

            <div className="flex shrink-0">
                <NowPlayingPlayButton variant="transparent" fill />
                <NowPlayingNextButton variant="transparent" />
            </div>

            <div
                className="bg-accent-600 pointer-events-none absolute bottom-0 left-0 h-0.5"
                style={{ width: `${(100 * currentTime) / track.duration}%` }}
            />
        </div>
    )
}
