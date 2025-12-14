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

import { venusGetPlaylistById } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { FullPageActionErrorComponents } from "@/app/action/full-action-error-component"
import {
    PageContent,
    PageLayout,
    PageSidebar,
} from "@/app/components/layout/page-layout"
import { PlaylistPlaybackButtons } from "@/app/venus/playlists/[id]/playlist-playback-buttons"
import { PlaylistUser } from "@/app/venus/playlists/[id]/playlist-user"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { venusPlaylistFetchTag } from "@/app/venus/venus-fetch-tags"
import { PlaylistTracks } from "@/app/venus/playlists/[id]/playlist-tracks"

const PlaylistPage = async ({ params }: PageProps<"/venus/playlists/[id]">) => {
    const playlistId = +(await params).id
    const result = await actionFromFetch(
        venusGetPlaylistById({
            path: {
                playlist_id: playlistId,
            },
            next: {
                tags: [venusPlaylistFetchTag(playlistId)],
            },
        }),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return (
            <ActionErrorMessage
                result={result}
                mapper={venusErrorMapper}
                components={FullPageActionErrorComponents}
            />
        )
    }

    const playlist = result.data

    return (
        <PageLayout>
            <PageSidebar className="flex flex-col gap-6">
                <div className="flex min-w-0 grow flex-col gap-1">
                    <h1 className="-my-1 w-full pb-2 text-3xl font-semibold wrap-break-word">
                        {playlist.name}
                    </h1>

                    <p className="tracking-sm text-sm font-medium text-gray-400 uppercase tabular-nums">
                        {playlist.playlist_tracks.length} track
                        {playlist.playlist_tracks.length !== 1 && "s"}
                    </p>

                    <PlaylistUser userId={playlist.author} />
                </div>

                <PlaylistPlaybackButtons playlist={playlist} />
            </PageSidebar>
            <PageContent className="flex flex-col">
                <PlaylistTracks playlist={playlist} />
            </PageContent>
        </PageLayout>
    )
}

export default PlaylistPage
