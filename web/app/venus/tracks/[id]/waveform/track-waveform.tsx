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

import { TrackDto } from "@/apis/venus"
import { cx } from "@/app/cva.config"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"
import { usePlayer } from "@/app/venus/playback/player-context"

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

type TrackWaveformProps = {
    track: TrackDto
    waveform: number[]
}

export const TrackWaveform = ({ track, waveform }: TrackWaveformProps) => {
    const currentTrackId = usePlaybackQueue(
        (state) => state.currentTrack?.track?.id,
    )
    const { currentTime } = usePlayer()

    return (
        <div
            className="grid h-32 items-center gap-0.5"
            style={{
                gridTemplateColumns: `repeat(${waveform.length}, 1fr)`,
            }}
        >
            {waveform.map((value, i) => (
                <div
                    key={i}
                    className={cx(
                        "bg-accent-600",
                        currentTrackId === track.id &&
                            i / waveform.length >
                                currentTime / track.duration &&
                            "bg-gray-700",
                    )}
                    style={{ height: (128 * value) / 255 }}
                />
            ))}
        </div>
    )
}
