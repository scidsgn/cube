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

import { PlaylistTrackDto, PlaylistWithTracksDto } from "@/apis/venus"
import { useAction } from "@/app/action/use-action"
import { TracklistItem } from "@/app/venus/components/tracklist/tracklist-item"
import { deleteTrackFromPlaylistAction } from "@/app/venus/playlists/playlist-actions"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { ComponentProps } from "react"
import { trackDtoToPlayerTrack } from "@/app/venus/playback/player-track-types"

type PlaylistItemProps = {
    playlist: PlaylistWithTracksDto
    track: PlaylistTrackDto
} & Omit<ComponentProps<typeof TracklistItem>, "track">

export const PlaylistItem = ({
    playlist,
    track,
    ...props
}: PlaylistItemProps) => {
    const deleteTrackFromPlaylist = useAction(
        deleteTrackFromPlaylistAction,
        venusErrorMapper,
    )

    return (
        <TracklistItem
            {...props}
            track={trackDtoToPlayerTrack(track.track)}
            menu={[
                {
                    type: "item",
                    name: "Remove from playlist",
                    icon: "delete",
                    onClick: () =>
                        deleteTrackFromPlaylist.run(playlist.id, track.id),
                },
            ]}
        />
    )
}
