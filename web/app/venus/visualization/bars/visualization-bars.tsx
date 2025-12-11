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

import { generatePalette } from "@/app/components/accent/generate-palette"
import { useAudioContext } from "@/app/venus/playback/audio-context"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"
import { usePlayer } from "@/app/venus/playback/player-context"
import { useResizeObserver } from "@mantine/hooks"
import { useEffect, useMemo, useRef, useState } from "react"

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

const binCount = 1024
const binGap = 0
const peakDecay = 0.997
const logBins = false

export const VisualizationBars = () => {
    const { obtain } = useAudioContext()
    const { audioNode } = usePlayer()

    const currentTrack = usePlaybackQueue((state) => state.currentTrack?.track)
    const currentAccentColor = useMemo(() => {
        return currentTrack?.artwork?.accent_color
    }, [currentTrack])
    const accent = generatePalette(currentAccentColor ?? "#fff")

    const [containerRef, containerSize] = useResizeObserver()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [analyzerNode, setAnalyzerNode] = useState<AnalyserNode | null>(null)

    useEffect(() => {
        if (!audioNode) {
            return
        }

        const audioContext = obtain()
        if (!audioContext) {
            return
        }

        const analyserNode = audioContext.createAnalyser()
        analyserNode.fftSize = binCount * 2
        analyserNode.smoothingTimeConstant = 0.6
        audioNode.connect(analyserNode)

        setAnalyzerNode(analyserNode)

        return () => audioNode.disconnect(analyserNode)
    }, [audioNode, obtain])

    useEffect(() => {
        // TODO THIS RAF MIGHT BE BUGGED
        if (!analyzerNode || !canvasRef.current) {
            return
        }

        const canvas = canvasRef.current

        const binTarget = new Float32Array(binCount)
        const peaks = new Float32Array(binCount)

        let running = true

        const rafCallback = () => {
            if (running) {
                requestAnimationFrame(rafCallback)
            }
            analyzerNode.getFloatFrequencyData(binTarget)

            const context = canvas.getContext("2d")
            if (!context) {
                return
            }

            context.clearRect(0, 0, canvas.width, canvas.height)

            const binWidth = (canvas.width - (binCount - 1) * binGap) / binCount

            for (let i = 0; i < binCount; i++) {
                const correction = 1 - (i / binCount) * 0.5
                const scaledValue =
                    (10 ** (binTarget[i] / 100) * 1.5) / correction

                peaks[i] =
                    scaledValue >= peaks[i]
                        ? scaledValue
                        : decay(peaks[i], scaledValue)

                const logStart =
                    (Math.log(i + 1) / Math.log(binCount + 1)) *
                    (canvas.width - (binCount - 1) * binGap)
                const logEnd =
                    (Math.log(i + 2) / Math.log(binCount + 1)) *
                    (canvas.width - (binCount - 1) * binGap)

                const height = scaledValue * canvas.height
                const width = logBins ? logEnd - logStart : binWidth
                const offset = logBins
                    ? logStart + i * binGap
                    : i * (binWidth + binGap)

                context.fillStyle = accent[950]
                context.fillRect(
                    Math.floor(offset),
                    canvas.height - peaks[i] * canvas.height,
                    Math.ceil(width),
                    peaks[i] * canvas.height,
                )

                const gradient = context.createLinearGradient(
                    0,
                    canvas.height - height,
                    0,
                    canvas.height,
                )
                gradient.addColorStop(0, accent[900])
                gradient.addColorStop(1, accent[300])
                context.fillStyle = gradient
                // context.fillStyle = chroma
                //     .mix(
                //         accent.palette[900],
                //         accent.palette[200],
                //         scaledValue,
                //         "oklch",
                //     )
                //     .hex()
                context.fillRect(
                    Math.floor(offset),
                    canvas.height - height,
                    Math.ceil(width),
                    height,
                )
            }
        }

        requestAnimationFrame(rafCallback)

        return () => {
            running = false
        }
    }, [analyzerNode, accent])

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }

        canvasRef.current.width = containerSize.width
        canvasRef.current.height = containerSize.height
    }, [containerSize])

    return (
        <div className="absolute inset-0" ref={containerRef}>
            <canvas ref={canvasRef} />
        </div>
    )
}

function decay(peak: number, target: number) {
    const factor = 1000
    const lerpPosition =
        1 - (Math.atan(factor * Math.abs(peak - target)) * 2) / Math.PI

    return peak + lerpPosition * (target - peak)
}
