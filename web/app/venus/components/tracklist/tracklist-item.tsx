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

import { actionFailed } from "@/app/action/action"
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
import {
    PlaybackBaseTrack,
    usePlaybackQueue,
} from "@/app/venus/playback/playback-queue-store"
import {
    addTrackToPlaylistAction,
    getPlaylistsAction,
} from "@/app/venus/playlists/playlist-actions"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import Link from "next/link"
import { Fragment, ReactNode } from "react"
import useSWR from "swr"

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

type TracklistItemProps = {
    track: PlaybackBaseTrack
    columns: TracklistColumn[]
    showTrackNumber?: boolean
    surroundingTracks?: PlaybackBaseTrack[]
    menu?: Menu
}

export const TracklistItem = ({
    track,
    columns,
    showTrackNumber,
    surroundingTracks,
    menu,
}: TracklistItemProps) => {
    const playlistsData = useSWR("venus-playlists", () => getPlaylistsAction())
    const playlists =
        (playlistsData.data &&
            !actionFailed(playlistsData.data) &&
            playlistsData.data.data.playlists) ||
        []

    const addTrackToPlaylist = useAction(
        addTrackToPlaylistAction,
        venusErrorMapper,
        {
            onSuccess: () =>
                openToast({
                    title: "Track added to playlist",
                    message: "Yay!",
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
                {track.disc_track && (
                    <Link
                        className="text-accent-500/80 font-medium"
                        href={`/venus/albums/${track.disc_track.disc.album.id}`}
                    >
                        {track.disc_track.disc.album.title}
                    </Link>
                )}
            </span>
        ),
        tempo: (
            <span className="font-mono text-gray-300/80">
                {track.musical_features &&
                    `${Math.round(track.musical_features.bpm)} BPM`}
            </span>
        ),
        key: (
            <span className="font-mono text-gray-300/80">
                {track.musical_features &&
                    `${track.musical_features.key} ${track.musical_features.scale}`}
            </span>
        ),
    }

    const firstColumnItem = showTrackNumber ? (
        <span className="w-9 text-center font-mono text-gray-300/80 group-hover:opacity-0">
            {track.disc_track?.track_number}
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
                  ...playlists.map((playlist) => ({
                      type: "item",
                      name: `Add to ${playlist.name}`,
                      icon: "playlist_add",
                      onClick: () =>
                          addTrackToPlaylist.run(playlist.id, track.id),
                  })),
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
