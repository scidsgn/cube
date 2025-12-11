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
import { useAccentStyle } from "@/app/components/accent/accent-provider"
import { Button, LinkButton } from "@/app/components/button/button"
import { TextLink } from "@/app/components/link/text-link"
import { Duration } from "@/app/components/text/duration"
import { ArtistsList } from "@/app/venus/components/artists-list"
import { TrackCoverArtwork } from "@/app/venus/components/cover-artwork/track-cover-artwork"
import { NowPlayingSlider } from "@/app/venus/now-playing/bar/now-playing-slider"
import { NowPlayingNextButton } from "@/app/venus/now-playing/transport/now-playing-next-button"
import { NowPlayingPlayButton } from "@/app/venus/now-playing/transport/now-playing-play-button"
import { NowPlayingPreviousButton } from "@/app/venus/now-playing/transport/now-playing-previous-button"
import {
    PlaybackBaseTrack,
    usePlaybackQueue,
} from "@/app/venus/playback/playback-queue-store"
import { usePlaybackSettings } from "@/app/venus/playback/playback-settings-store"
import { usePlayer } from "@/app/venus/playback/player-context"

type NowPlayingCurrentProps = {
    track: PlaybackBaseTrack
}

export const NowPlayingCurrent = ({ track }: NowPlayingCurrentProps) => {
    const {
        currentTime,
        seek,
        startSeeking,
        stopSeeking,

        loop,
        setLoop,
    } = usePlayer()

    const volume = usePlaybackSettings((state) => state.volume)
    const setVolume = usePlaybackSettings((state) => state.setVolume)

    const shuffle = usePlaybackQueue((state) => state.shuffle)
    const setShuffle = usePlaybackQueue((state) => state.setShuffle)

    const repeat = usePlaybackQueue((state) => state.repeat)
    const setRepeat = usePlaybackQueue((state) => state.setRepeat)

    const toggleRepeat = () => {
        if (!repeat && !loop) {
            setRepeat(true)
        }
        if (repeat && !loop) {
            setRepeat(true)
            setLoop(true)
        }
        if (repeat && loop) {
            setRepeat(false)
            setLoop(false)
        }
    }

    const accentStyle = useAccentStyle()

    return (
        <div className="w-full min-w-0" style={accentStyle}>
            <div className="bg-accent-950 flex items-center gap-3 px-6 py-4">
                <div className="relative size-12">
                    <TrackCoverArtwork size={48} track={track} />
                    <LinkButton
                        className="absolute inset-0 grid size-12 place-items-center opacity-0 hover:opacity-100 active:opacity-100"
                        variant="accent"
                        icon="fullscreen"
                        href="/venus/now-playing"
                        title="Open full screen mode"
                    />
                </div>

                <div className="flex min-w-0 grow flex-col">
                    <div className="flex min-w-0 items-center gap-1">
                        <TextLink
                            className="truncate font-medium text-gray-50"
                            href={`/venus/tracks/${track.id}`}
                        >
                            {track.title}
                        </TextLink>
                        <Button
                            className="h-[unset] p-0"
                            variant="transparent"
                            icon="star"
                        />
                    </div>
                    <span className="truncate text-sm font-medium">
                        <ArtistsList
                            className="text-accent-500"
                            artists={track.artists}
                        />
                    </span>
                </div>

                <div className="flex shrink-0">
                    <Button
                        variant={repeat || loop ? "accent" : "transparent"}
                        icon={loop ? "repeat_one" : "repeat"}
                        onClick={toggleRepeat}
                    />
                    <Button
                        variant={shuffle ? "accent" : "transparent"}
                        icon="shuffle"
                        onClick={() => setShuffle(!shuffle)}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 px-6 pt-3 pb-4">
                <div className="flex flex-col">
                    <div className="flex justify-between">
                        <span className="text-accent-300 font-mono text-xs font-medium">
                            <Duration>{currentTime}</Duration>
                        </span>
                        <span className="font-mono text-xs font-medium text-gray-500">
                            <Duration>{track.duration}</Duration>
                        </span>
                    </div>

                    <NowPlayingSlider
                        value={currentTime * 100}
                        min={0}
                        max={track.duration * 100}
                        onStartChange={() => startSeeking()}
                        onEndChange={() => stopSeeking()}
                        onChange={(v) => seek(v / 100)}
                    />
                </div>

                <div className="flex items-center gap-1">
                    <div className="flex grow items-center gap-1">
                        <NowPlayingPreviousButton />
                        <NowPlayingPlayButton variant="accent" />
                        <NowPlayingNextButton />
                    </div>

                    <Button variant="transparent" icon="volume_up" />
                    <div className="w-20">
                        <NowPlayingSlider
                            value={volume * 100}
                            min={0}
                            max={100}
                            onChange={(v) => setVolume(v / 100)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
