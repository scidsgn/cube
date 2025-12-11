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
import chroma from "chroma-js"

type Palette = Record<
    50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950,
    string
>

export function generatePalette(accentColor: string) {
    const color = chroma(accentColor)
    const [, c, h] = color.oklch()

    const colors = Array.from({ length: 11 }).map((_, i) => {
        const f = i / 10
        const l = ((1 - f) * 0.9 + 0.08) ** 0.6
        const sc = c * (1 - 3 * (f - 0.5) ** 2)

        return chroma.oklch(l, sc, h).hex()
    })

    return Object.fromEntries(
        colors.map((hex, i) => {
            const key = i === 0 ? 50 : i === 10 ? 950 : i * 100

            return [key, hex]
        }),
    ) as Palette
}
