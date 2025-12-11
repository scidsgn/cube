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
import { create } from "zustand"
import { persist } from "zustand/middleware"

type PlaybackSettingsState = {
    volume: number

    setVolume: (volume: number) => void
}

export const usePlaybackSettings = create<PlaybackSettingsState>()(
    persist(
        (set) => ({
            volume: 1,

            setVolume: (volume) => set({ volume }),
        }),
        {
            name: "venus-playback-settings",
            partialize: ({ volume }) => ({ volume }),
        },
    ),
)
