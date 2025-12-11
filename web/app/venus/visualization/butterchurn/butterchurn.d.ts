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

declare module "butterchurn" {
    import { Preset } from "butterchurn-presets"

    export interface Image {
        data: string
        width: number
        height: number
    }

    export interface Visualizer {
        connectAudio(audioNode: AudioNode): void
        disconnectAudio(audioNode: AudioNode): void
        loadExtraImages(images: Record<string, Image>):void
        loadPreset(preset: Preset, transitionTime: number): void
        setRendererSize(width: number, height: number): void
        render(): void
    }

    function createVisualizer(
        audioContext: AudioContext,
        canvas: HTMLCanvasElement,
        options: { width: number; height: number },
    ): Visualizer

    const butterchurn = {
        createVisualizer,
    }

    export default butterchurn
}
declare module "butterchurn/lib/butterchurnExtraImages.min" {
    import { Image } from "butterchurn"

    function getImages(): Record<string, Image>

    const butterchurnImages = {getImages}

    export default butterchurnImages
}

declare module "butterchurn-presets" {
    type Preset = unique symbol

    function getPresets(): Record<string, Preset>

    const butterchurnPresets = {getPresets}

    export default butterchurnPresets
}
