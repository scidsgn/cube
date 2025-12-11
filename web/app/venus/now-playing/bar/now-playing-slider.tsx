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
import { Range, Root, Thumb, Track } from "@radix-ui/react-slider"

type NowPlayingSliderProps = {
    value: number
    min: number
    max: number
    onChange: (value: number) => void
    onStartChange?: () => void
    onEndChange?: () => void
}

export const NowPlayingSlider = ({
    value,
    min,
    max,
    onChange,
    onStartChange,
    onEndChange,
}: NowPlayingSliderProps) => {
    return (
        <Root
            value={[value]}
            min={min}
            max={max}
            className="relative flex h-4 w-full cursor-pointer items-center"
            onValueChange={(values) => onChange(values[0]!)}
            onPointerDown={() => onStartChange?.()}
            onPointerUp={() => onEndChange?.()}
        >
            <Track className="relative h-1 grow bg-gray-950">
                <Range className="bg-accent-600 absolute h-full" />
            </Track>
            <Thumb className="bg-accent-500 block size-4" />
        </Root>
    )
}
