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
import { Button, ButtonProps } from "@/app/components/button/button"
import {
    PlayerPlaybackState,
    usePlayer,
} from "@/app/venus/playback/player-context"

export const NowPlayingPlayButton = (
    props: Omit<ButtonProps, "icon" | "onClick" | "title">,
) => {
    const { playbackState, pause, resume, repeat } = usePlayer()

    return (
        <Button
            {...props}
            icon={
                playbackState === PlayerPlaybackState.playing
                    ? "pause"
                    : "play_arrow"
            }
            onClick={() => {
                switch (playbackState) {
                    case PlayerPlaybackState.playing: {
                        pause()
                        break
                    }
                    case PlayerPlaybackState.paused: {
                        resume()
                        break
                    }
                    case PlayerPlaybackState.stopped: {
                        repeat()
                        break
                    }
                }
            }}
            title={
                playbackState === PlayerPlaybackState.playing
                    ? "Pause playback"
                    : playbackState === PlayerPlaybackState.paused
                      ? "Resume playback"
                      : "Play"
            }
        />
    )
}
