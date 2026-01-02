/*
 * CUBE
 * Copyright (C) 2025-2026  scidsgn
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

import { setupClients } from "@/apis/client-setup"
import { Header } from "@/app/header/header"
import { HeaderContextProvider } from "@/app/header/header-context"
import { Providers } from "@/app/providers"
import { NowPlayingPanel } from "@/app/venus/now-playing/panel/now-playing-panel"
import type { Metadata } from "next"
import { ReactNode } from "react"

import "./globals.css"
import { jetbrainsMono } from "@/app/fonts/jetbrains-mono/jetbrains-mono"
import { publicSans } from "@/app/fonts/plus-jakarta-sans/public-sans"

export const metadata: Metadata = {
    title: "CUBE",
}

setupClients()

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${jetbrainsMono.variable} ${publicSans.variable} antialiased`}
            >
                <HeaderContextProvider>
                    <Providers>
                        <Header />
                        <main className="fixed inset-0 flex min-w-0">
                            <div className="relative grow">{children}</div>

                            <NowPlayingPanel />
                        </main>
                    </Providers>
                </HeaderContextProvider>
            </body>
        </html>
    )
}
