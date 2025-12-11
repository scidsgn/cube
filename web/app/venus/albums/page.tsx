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
import { venusGetAlbums } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { FullPageActionErrorComponents } from "@/app/action/full-action-error-component"
import {
    PageContent,
    PageLayout,
    PageSidebar,
} from "@/app/components/layout/page-layout"
import { CoverArtwork } from "@/app/venus/components/cover-artwork/cover-artwork"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import Link from "next/link"
import { Fragment } from "react"

const AlbumsPage = async () => {
    const result = await actionFromFetch(
        venusGetAlbums(),
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

    const albums = result.data.albums

    const letters = Array.from(
        new Set(
            albums.map((album) =>
                album.title.trim().substring(0, 1).toUpperCase(),
            ),
        ),
    ).sort((n1, n2) => n1.localeCompare(n2))

    return (
        <PageLayout>
            <PageSidebar className="flex flex-col gap-6">
                <h1 className="text-4xl font-semibold">Albums</h1>
            </PageSidebar>
            <PageContent className="flex flex-col gap-1">
                {letters.map((letter, i) => (
                    <Fragment key={letter}>
                        <div className="sticky top-0 grid size-8 place-items-center bg-gray-500 text-xl font-semibold text-gray-950">
                            {letter}
                        </div>

                        <div className="mb-3 flex flex-wrap gap-1">
                            {albums
                                .filter(
                                    (album) =>
                                        album.title
                                            .trim()
                                            .substring(0, 1)
                                            .toUpperCase() === letter,
                                )
                                .map((album) => (
                                    <Link
                                        key={album.id}
                                        className="w-36 pb-2 hover:bg-gray-50/8 active:bg-gray-50/15"
                                        href={`/venus/albums/${album.id}`}
                                        title={album.title}
                                    >
                                        <CoverArtwork
                                            size={144}
                                            artwork={album.artwork}
                                            alt={`${album.title} cover art`}
                                        />
                                        <div className="line-clamp-2 px-3 pt-2 font-medium">
                                            {album.title}
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </Fragment>
                ))}
            </PageContent>
        </PageLayout>
    )
}

export default AlbumsPage
