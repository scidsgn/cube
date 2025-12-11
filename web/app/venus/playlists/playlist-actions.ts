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

"use server"

import {
    venusAddTrackToPlaylist,
    venusCreatePlaylist,
    venusDeleteTrackFromPlaylist,
    venusGetPlaylists,
} from "@/apis/venus"
import { actionFromResponse } from "@/app/action/action"
import { ActionOutcome } from "@/app/action/action-types"
import { actionFromFetch } from "@/app/action/fetch-action"
import { venusPlaylistFetchTag } from "@/app/venus/venus-fetch-tags"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"

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

export async function getPlaylistsAction() {
    return await actionFromFetch(venusGetPlaylists(), (error) => error.code)
}

export async function createPlaylistAction(name: string) {
    const { data, response, error } = await venusCreatePlaylist({
        body: {
            name,
        },
    })
    const result = actionFromResponse(response, error?.code)

    if (result === ActionOutcome.ok && data) {
        redirect(`/venus/playlists/${data.id}`)
    }

    return result
}

export async function addTrackToPlaylistAction(
    playlistId: number,
    trackId: number,
) {
    const { response, error } = await venusAddTrackToPlaylist({
        path: {
            playlist_id: playlistId,
        },
        body: {
            track_id: trackId,
        },
    })
    const result = actionFromResponse(response, error?.code)

    return result
}

export async function deleteTrackFromPlaylistAction(
    playlistId: number,
    playlistTrackId: number,
) {
    const { response, error } = await venusDeleteTrackFromPlaylist({
        path: {
            playlist_id: playlistId,
            playlist_track_id: playlistTrackId,
        },
    })
    const result = actionFromResponse(response, error?.code)

    if (result === ActionOutcome.ok) {
        revalidateTag(venusPlaylistFetchTag(playlistId), "max")
    }

    return result
}
