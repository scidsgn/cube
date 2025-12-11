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
import { useAudioContext } from "@/app/venus/playback/audio-context"
import { usePlayer } from "@/app/venus/playback/player-context"
import { useResizeObserver } from "@mantine/hooks"
import butterchurn, { Visualizer } from "butterchurn"
import butterchurnPresets from "butterchurn-presets"
import butterchurnImages from "butterchurn/lib/butterchurnExtraImages.min"
import { useEffect, useRef, useState } from "react"

const presets = butterchurnPresets.getPresets()

export const VisualizationButterchurnClient = () => {
    const { obtain } = useAudioContext()
    const { audioNode } = usePlayer()

    const [containerRef, containerSize] = useResizeObserver()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [visualizer, setVisualizer] = useState<Visualizer | null>(null)

    useEffect(() => {
        if (!audioNode || !canvasRef.current) {
            return
        }

        const audioContext = obtain()
        if (!audioContext) {
            return
        }
        const visualizer = butterchurn.createVisualizer(
            audioContext,
            canvasRef.current,
            {
                width: canvasRef.current.clientWidth,
                height: canvasRef.current.clientHeight,
            },
        )
        visualizer.loadExtraImages(butterchurnImages.getImages())
        visualizer.connectAudio(audioNode)
        visualizer.loadPreset(random(Object.values(presets)), 0)
        setVisualizer(visualizer)

        return () => {
            visualizer.disconnectAudio(audioNode)
        }
    }, [audioNode, obtain])

    useEffect(() => {
        if (!visualizer || !canvasRef.current) {
            return
        }

        canvasRef.current.width = containerSize.width
        canvasRef.current.height = containerSize.height
        visualizer.setRendererSize(containerSize.width, containerSize.height)
    }, [visualizer, containerSize])

    useEffect(() => {
        if (!visualizer) {
            return
        }

        let running = true

        const rafCallback = () => {
            if (running) {
                requestAnimationFrame(rafCallback)
            }

            visualizer.render()
        }

        requestAnimationFrame(rafCallback)

        return () => {
            running = false
        }
    }, [visualizer])

    useEffect(() => {
        if (!visualizer) {
            return
        }

        console.log(visualizer)

        const interval = window.setInterval(() => {
            visualizer.loadPreset(random(Object.values(presets)), 0.5)
        }, 10000)

        return () => clearInterval(interval)
    }, [visualizer])

    return (
        <div className="absolute inset-0" ref={containerRef}>
            <canvas ref={canvasRef} />
        </div>
    )
}

function random<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)]
}
