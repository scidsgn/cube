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

import { useAudioContext } from "@/app/venus/playback/audio-context"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"
import { usePlaybackSettings } from "@/app/venus/playback/playback-settings-store"
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"

export enum PlayerPlaybackState {
    playing = "playing",
    paused = "paused",
    stopped = "stopped",
}

type PlayerContextValue = {
    playbackState: PlayerPlaybackState
    currentTime: number
    duration: number

    loop: boolean
    setLoop: (loop: boolean) => void

    audioNode: AudioNode | null

    startSeeking: () => void
    stopSeeking: () => void
    seek: (time: number) => void

    pause: () => void
    resume: () => void
    repeat: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

type PlayerProviderProps = {
    children?: ReactNode
}

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
    const { obtain } = useAudioContext()

    const currentTrack = usePlaybackQueue((state) => state.currentTrack)
    const currentUrl = useMemo(
        () =>
            currentTrack
                ? `/venus/api/original-streams/${currentTrack.track.id}`
                : null,
        [currentTrack],
    )

    const canGoNext = usePlaybackQueue((state) => state.canGoNext)
    const next = usePlaybackQueue((state) => state.next)

    const audioRef = useRef<HTMLAudioElement>(null)
    const [audioNode, setAudioNode] = useState<AudioNode | null>(null)
    const [gainNode, setGainNode] = useState<GainNode | null>(null)

    const [playbackState, setPlaybackState] = useState<PlayerPlaybackState>(
        PlayerPlaybackState.stopped,
    )

    const [currentTime, setCurrentTime] = useState(0)
    const seekingRef = useRef(false)

    const [duration, setDuration] = useState(0)

    const [loop, setLoop] = useState(false)

    const volume = usePlaybackSettings((state) => state.volume)
    const muted = usePlaybackSettings((state) => state.muted)

    const startSeeking = useCallback(() => {
        seekingRef.current = true
    }, [])

    const stopSeeking = useCallback(() => {
        seekingRef.current = false
    }, [])

    const seek = useCallback((time: number) => {
        if (!audioRef.current || !seekingRef.current) {
            return
        }

        setCurrentTime(time)
        audioRef.current.currentTime = time
    }, [])

    const repeat = useCallback(() => {
        if (!audioRef.current) {
            return
        }

        audioRef.current.currentTime = 0
        audioRef.current.play()
        seekingRef.current = false
        setCurrentTime(0)
    }, [])

    const pause = useCallback(() => {
        if (!audioRef.current) {
            return
        }

        audioRef.current.pause()
    }, [])

    const resume = useCallback(() => {
        if (!audioRef.current) {
            return
        }

        audioRef.current.play()
    }, [])

    useEffect(() => {
        if (!audioRef.current || audioNode) {
            return
        }
        const audioContext = obtain()
        if (!audioContext) {
            return
        }

        const mediaSourceNode = audioContext.createMediaElementSource(
            audioRef.current,
        )
        const gainNode = audioContext.createGain()

        mediaSourceNode.connect(gainNode)
        gainNode.connect(audioContext.destination)

        setAudioNode(mediaSourceNode)
        setGainNode(gainNode)
    }, [obtain, currentUrl, audioNode])

    useEffect(() => {
        if (!gainNode) {
            return
        }

        gainNode.gain.value = exponentialVolume(muted ? 0 : volume)
    }, [volume, muted, gainNode])

    return (
        <PlayerContext.Provider
            value={{
                audioNode,
                playbackState,
                currentTime,
                duration,
                startSeeking,
                stopSeeking,
                seek,
                repeat,
                loop,
                setLoop,
                pause,
                resume,
            }}
        >
            {currentUrl && (
                <audio
                    src={currentUrl}
                    autoPlay
                    crossOrigin="anonymous"
                    ref={audioRef}
                    onPlay={() => {
                        if (gainNode) {
                            gainNode.gain.value = exponentialVolume(
                                muted ? 0 : volume,
                            )
                        }

                        setPlaybackState(PlayerPlaybackState.playing)
                    }}
                    onPause={() => {
                        setPlaybackState(PlayerPlaybackState.paused)
                    }}
                    onEnded={() => {
                        if (gainNode) {
                            gainNode.gain.value = exponentialVolume(
                                muted ? 0 : volume,
                            )
                        }

                        seekingRef.current = false
                        if (loop) {
                            repeat()
                            return
                        } else if (canGoNext()) {
                            next()
                            return
                        }
                        setPlaybackState(PlayerPlaybackState.stopped)
                    }}
                    onDurationChange={(e) => {
                        setDuration(e.currentTarget.duration)
                    }}
                    onTimeUpdate={(e) => {
                        if (seekingRef.current) {
                            return
                        }

                        setCurrentTime(e.currentTarget.currentTime)
                    }}
                />
            )}
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error("usePlayer must be used within the context")
    }

    return context
}

function exponentialVolume(linearVolume: number) {
    const n = 2
    const amplitude = 10 ** -n * Math.exp(linearVolume * Math.log(10 ** n))

    if (linearVolume < 0.1) {
        return linearVolume * 10 * amplitude
    }

    return amplitude
}
