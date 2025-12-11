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
import { venusGetPlaylists } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { FullPageActionErrorComponents } from "@/app/action/full-action-error-component"
import {
    PageContent,
    PageLayout,
    PageSidebar,
} from "@/app/components/layout/page-layout"
import { PlaylistCreateButton } from "@/app/venus/playlists/playlist-create-button"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import Link from "next/link"

const PlaylistsPage = async () => {
    const result = await actionFromFetch(
        venusGetPlaylists(),
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

    const playlists = result.data.playlists

    return (
        <PageLayout>
            <PageSidebar className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold">Playlists</h1>

                <div>
                    <PlaylistCreateButton />
                </div>
            </PageSidebar>
            <PageContent className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-1">
                    {playlists.map((playlist) => (
                        <Link
                            key={playlist.id}
                            className="pb-2 hover:bg-gray-50/8 active:bg-gray-50/15"
                            href={`/venus/playlists/${playlist.id}`}
                            title={playlist.name}
                        >
                            <div className="grid size-36 place-items-center bg-gray-800 text-2xl font-bold">
                                {playlist.name
                                    .trim()
                                    .substring(0, 1)
                                    .toUpperCase()}
                            </div>
                            <div className="line-clamp-2 px-3 pt-2 font-medium">
                                {playlist.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </PageContent>
        </PageLayout>
    )
}

export default PlaylistsPage
