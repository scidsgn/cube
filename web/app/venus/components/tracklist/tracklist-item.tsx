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

"use client"

import { useAction } from "@/app/action/use-action"
import { AccentProvider } from "@/app/components/accent/accent-provider"
import { Button } from "@/app/components/button/button"
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { ContextMenu } from "@/app/components/menu/context-menu"
import { Dropdown } from "@/app/components/menu/dropdown"
import { Menu } from "@/app/components/menu/menu-types"
import { Duration } from "@/app/components/text/duration"
import { openToast } from "@/app/components/toast/toasts-store"
import { cx } from "@/app/cva.config"
import { ArtistsList } from "@/app/venus/components/artists-list"
import { TrackCoverArtwork } from "@/app/venus/components/cover-artwork/track-cover-artwork"
import {
    TracklistColumn,
    tracklistColumnsToGridTemplate,
} from "@/app/venus/components/tracklist/tracklist-column"
import { usePlaybackQueue } from "@/app/venus/playback/playback-queue-store"
import { addTrackToPlaylistAction } from "@/app/venus/playlists/playlist-actions"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import Link from "next/link"
import { Fragment, ReactNode } from "react"
import { usePlaylistContext } from "@/app/venus/playlists/context/playlist-context"
import { PlayerTrack } from "@/app/venus/playback/player-track-types"
import { useTracklist } from "@/app/venus/components/tracklist/tracklist-context"

type TracklistItemProps = {
    track: PlayerTrack
    columns: TracklistColumn[]
    showTrackNumber?: boolean
    menu?: Menu
}

export const TracklistItem = ({
    track,
    columns,
    showTrackNumber,
    menu,
}: TracklistItemProps) => {
    const { playlists } = usePlaylistContext()
    const { tracks: surroundingTracks } = useTracklist()

    const addTrackToPlaylist = useAction(
        addTrackToPlaylistAction,
        venusErrorMapper,
        {
            onSuccess: () =>
                openToast({
                    type: "info",
                    title: "Track added to playlist",
                    message: `${track.title} has been added to the end of the playlist.`,
                }),
        },
    )

    const currentTrackId = usePlaybackQueue(
        (state) => state.currentTrack?.track?.id,
    )
    const playTrack = usePlaybackQueue((state) => state.playTrack)
    const playTracks = usePlaybackQueue((state) => state.playTracks)
    const enqueue = usePlaybackQueue((state) => state.enqueue)

    const columnMarkup: Record<TracklistColumn, ReactNode> = {
        artists: (
            <span className="truncate font-medium text-gray-300/80">
                <ArtistsList
                    className="text-accent-500/80 font-medium"
                    artists={track.artists}
                />
            </span>
        ),
        album: (
            <span className="truncate">
                {track.album && (
                    <Link
                        className="text-accent-500/80 font-medium"
                        href={`/venus/albums/${track.album.id}`}
                    >
                        {track.album.title}
                    </Link>
                )}
            </span>
        ),
        tempo: (
            <span className="font-mono text-gray-300/80">
                {track.musicalFeatures &&
                    `${Math.round(track.musicalFeatures.bpm)} BPM`}
            </span>
        ),
        key: (
            <span className="font-mono text-gray-300/80">
                {track.musicalFeatures &&
                    `${track.musicalFeatures.key} ${track.musicalFeatures.scale}`}
            </span>
        ),
    }

    const trackNumber = `${track.album?.trackNumber}${track.album?.trackNumberSuffix || ""}`

    const firstColumnItem = showTrackNumber ? (
        <span
            className={cx(
                "w-9 text-center font-mono text-gray-300/80 group-hover:opacity-0",
                (trackNumber?.length ?? 0) > 2 && "text-xs font-medium",
            )}
        >
            {trackNumber}
        </span>
    ) : (
        <TrackCoverArtwork size={36} track={track} />
    )

    const currentlyPlaying = currentTrackId === track.id

    const trackMenu: Menu = [
        {
            type: "item",
            name: "Add to queue",
            icon: "playlist_add",
            onClick: () => enqueue([track]),
        },
        { type: "separator" },
        ...(menu ? ([...menu, { type: "separator" }] as Menu) : []),
        ...(playlists.length
            ? ([
                  {
                      type: "submenu",
                      icon: "playlist_add",
                      name: "Add to playlist",
                      menu: playlists.map((playlist) => ({
                          type: "item",
                          name: playlist.name,
                          icon: "playlist_add",
                          onClick: () =>
                              addTrackToPlaylist.run(playlist.id, track.id),
                      })),
                  },
                  { type: "separator" },
              ] as Menu)
            : []),
        {
            type: "item",
            name: "Track details",
            icon: "info",
            href: `/venus/tracks/${track.id}`,
        },
    ]

    return (
        <ContextMenu
            className={cx(
                "odd:bg-gray-900/30 hover:bg-gray-900",
                currentlyPlaying && "bg-accent-500/20 odd:bg-accent-500/25",
            )}
            menu={trackMenu}
        >
            <div
                className="group relative grid h-9 items-center gap-2 overflow-hidden text-sm"
                style={{
                    gridTemplateColumns: `36px 1.5fr ${tracklistColumnsToGridTemplate(columns)} 64px auto`,
                }}
            >
                <div className="relative grid size-9 place-items-center">
                    {currentTrackId === track.id ? (
                        <div className="text-accent-500 grid size-9 place-items-center">
                            <IconSymbol icon="graphic_eq" size={20} />
                        </div>
                    ) : (
                        firstColumnItem
                    )}

                    <AccentProvider color={track?.artwork?.accent_color}>
                        <Button
                            variant="accent"
                            icon="play_arrow"
                            fill
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 hover:opacity-100 active:opacity-100"
                            onClick={() => {
                                if (surroundingTracks) {
                                    playTracks(surroundingTracks, track)
                                } else {
                                    playTrack(track)
                                }
                            }}
                        />
                    </AccentProvider>
                </div>

                <span className="truncate font-medium">
                    {track.title}
                    {track.features.length > 0 && (
                        <>
                            {" "}
                            (feat.{" "}
                            <ArtistsList
                                className="text-accent-300/80 font-medium"
                                artists={track.features}
                            />
                            )
                        </>
                    )}
                    {track.remixers.length > 0 && (
                        <>
                            {" "}
                            (
                            <ArtistsList
                                className="text-accent-300/80 font-medium"
                                artists={track.remixers}
                            />{" "}
                            remix)
                        </>
                    )}
                </span>

                {columns.map((column) => (
                    <Fragment key={column}>{columnMarkup[column]}</Fragment>
                ))}

                <span className="pr-3 text-right font-mono text-gray-400">
                    <Duration>{track.duration}</Duration>
                </span>

                <div className="flex gap-1">
                    <Dropdown
                        variant="transparent"
                        icon="more_horiz"
                        menu={trackMenu}
                    />
                </div>
            </div>
        </ContextMenu>
    )
}
