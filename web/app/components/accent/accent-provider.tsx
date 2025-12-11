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
import {
    CSSProperties,
    ReactElement,
    ReactNode,
    createContext,
    useContext,
    useMemo,
} from "react"

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

const AccentStyleContext = createContext<CSSProperties>({})

type AccentProviderProps = {
    color?: string | null
    children?: ReactNode
}

export const AccentProvider = ({ color, children }: AccentProviderProps) => {
    const accentStyle = useMemo(() => {
        if (!color) {
            return {}
        }

        const palette = generatePalette(color)

        return Object.fromEntries(
            Object.entries(palette).map(([key, value]) => [
                `--accent-${key}`,
                value,
            ]),
        ) as CSSProperties
    }, [color])

    if (
        typeof children === "object" &&
        !(children instanceof Promise) &&
        !(Symbol.iterator in Object(children))
    ) {
        const originalElement = children as ReactElement<any> // eslint-disable-line @typescript-eslint/no-explicit-any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const modifiedElement: ReactElement<any> = {
            ...originalElement,
            props: {
                ...originalElement.props,
                style: {
                    ...originalElement.props.style,
                    ...accentStyle,
                },
            },
        }

        return (
            <AccentStyleContext.Provider value={accentStyle}>
                {modifiedElement}
            </AccentStyleContext.Provider>
        )
    }

    return (
        <AccentStyleContext.Provider value={accentStyle}>
            {children}
        </AccentStyleContext.Provider>
    )
}

export function useAccentStyle() {
    return useContext(AccentStyleContext)
}
