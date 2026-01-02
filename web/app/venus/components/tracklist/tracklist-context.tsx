/*
 * CUBE
 * Copyright (C) 2026  scidsgn
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

import { PlayerTrack } from "@/app/venus/playback/player-track-types"
import { createContext, ReactNode, useContext } from "react"

type TracklistContextValue = {
    tracks: PlayerTrack[]
}

const TracklistContext = createContext<TracklistContextValue>({
    tracks: [],
})

type TracklistProviderProps = {
    children?: ReactNode
    tracks: PlayerTrack[]
}

export const TracklistProvider = ({
    children,
    tracks,
}: TracklistProviderProps) => {
    return <TracklistContext value={{ tracks }}>{children}</TracklistContext>
}

export function useTracklist() {
    return useContext(TracklistContext)
}
