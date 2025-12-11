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

import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
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

type AudioContextValue = {
    obtain: () => AudioContext | null
}

const ReactAudioContext = createContext<AudioContextValue | null>(null)

export const AudioContextProvider = ({
    children,
}: {
    children?: ReactNode
}) => {
    const audioContextRef = useRef<AudioContext | null>(null)

    const obtain = useCallback(() => {
        if (audioContextRef.current) {
            return audioContextRef.current
        }

        const audioContext = new AudioContext()
        if (audioContext.state === "suspended") {
            return null
        }
        audioContextRef.current = audioContext

        return audioContext
    }, [])

    const contextValue = useMemo(() => ({ obtain }), [obtain])

    return (
        <ReactAudioContext.Provider value={contextValue}>
            {children}
        </ReactAudioContext.Provider>
    )
}

export function useAudioContext() {
    const context = useContext(ReactAudioContext)
    if (!context) {
        throw new Error("useAudioContext must be used within the context")
    }

    return context
}
