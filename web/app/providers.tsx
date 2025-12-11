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
import { Toasts } from "@/app/components/toast/toasts"
import { AudioContextProvider } from "@/app/venus/playback/audio-context"
import { PlayerProvider } from "@/app/venus/playback/player-context"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ReactNode } from "react"

export const Providers = ({ children }: { children?: ReactNode }) => (
    <NuqsAdapter>
        <AudioContextProvider>
            <PlayerProvider>
                {children}
                <Toasts />
            </PlayerProvider>
        </AudioContextProvider>
    </NuqsAdapter>
)
