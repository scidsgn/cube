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

import { SyncedLyrics } from "@/apis/venus"
import { cx } from "@/app/cva.config"
import { usePlayer } from "@/app/venus/playback/player-context"
import { useEffect, useMemo, useRef } from "react"

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

type NowPlayingLyricsProps = {
    lyrics: SyncedLyrics
}

const deltaCorrection = 0.3

export const NowPlayingLyrics = ({ lyrics }: NowPlayingLyricsProps) => {
    const { currentTime } = usePlayer()
    const containerRef = useRef<HTMLDivElement>(null)

    const currentLineIndex = useMemo(() => {
        return lyrics.lines.findIndex(
            (line) =>
                line.start - deltaCorrection <= currentTime &&
                line.end - deltaCorrection > currentTime,
        )
    }, [currentTime, lyrics])

    useEffect(() => {
        if (currentLineIndex === -1 || !containerRef.current) {
            return
        }

        const container = containerRef.current

        const lyric = container.children[0]?.children[currentLineIndex]
        if (lyric) {
            lyric.scrollIntoView({ behavior: "smooth" })
        }
    }, [currentLineIndex])

    return (
        <div
            className="pointer-events-none absolute top-30 right-0 bottom-0 overflow-y-scroll p-6"
            ref={containerRef}
            style={{
                scrollbarWidth: "none",
                maskImage:
                    "linear-gradient(to bottom, white 80px, transparent 40vh)",
            }}
        >
            <div className="flex flex-col gap-6">
                {lyrics.lines.map((line, i) => (
                    <p
                        key={i}
                        className={cx(
                            "text-right text-6xl font-normal opacity-50 transition-[opacity,font-weight]",
                            currentLineIndex === i &&
                                "font-semibold opacity-100",
                        )}
                        style={{
                            textShadow:
                                "0px 8px 16px var(--color-gray-950), 0px 2px 4px var(--color-gray-950)",
                        }}
                    >
                        {line.line}
                    </p>
                ))}
            </div>
            <div className="h-screen" />
        </div>
    )
}
