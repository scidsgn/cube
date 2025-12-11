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

import { AccentProvider } from "@/app/components/accent/accent-provider"
import { Button } from "@/app/components/button/button"
import { ScrollArea } from "@/app/components/scroll-area"
import { Tab, Tabs } from "@/app/components/tabs/tabs"
import { cx } from "@/app/cva.config"
import { useNowPlaying } from "@/app/venus/now-playing/now-playing-store"
import { NowPlayingCurrent } from "@/app/venus/now-playing/panel/now-playing-current"
import { NowPlayingPanelLyrics } from "@/app/venus/now-playing/panel/now-playing-panel-lyrics"
import { NowPlayingQueue } from "@/app/venus/now-playing/panel/now-playing-queue"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"

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

export const NowPlayingPanel = () => {
    const track = usePlaybackQueue((state) => state.currentTrack?.track)

    const expanded = useNowPlaying((state) => state.expanded)
    const setExpanded = useNowPlaying((state) => state.setExpanded)

    return (
        <aside
            className={cx(
                "relative w-0 overflow-hidden bg-black transition-[width]",
                expanded && track && "w-111",
            )}
        >
            <div className="absolute top-0 right-0 bottom-0 grid w-111 grid-rows-[auto_auto_1fr]">
                <header className="flex p-6 pr-17">
                    <div className="flex h-9 grow items-center text-lg font-medium">
                        Now playing
                    </div>

                    <Button
                        icon="right_panel_close"
                        variant="transparent"
                        onClick={() => setExpanded(false)}
                    />
                </header>

                {track && (
                    <AccentProvider color={track.artwork?.accent_color}>
                        <NowPlayingCurrent track={track} />
                        <ScrollArea
                            className="min-h-0 max-w-full min-w-0"
                            viewportClassName="[&>div]:block!"
                        >
                            <div className="p-6 pt-0">
                                <Tabs
                                    defaultValue="queue"
                                    listClassName="bg-black pb-4"
                                >
                                    <Tab value="queue" button="Queue">
                                        <NowPlayingQueue track={track} />
                                    </Tab>
                                    <Tab value="lyrics" button="Lyrics">
                                        <NowPlayingPanelLyrics track={track} />
                                    </Tab>
                                </Tabs>
                            </div>
                        </ScrollArea>
                    </AccentProvider>
                )}
            </div>
        </aside>
    )
}
