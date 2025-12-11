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
import { ArtistWithDetailsDto, venusGetArtistAlbums } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { ScrollArea } from "@/app/components/scroll-area"
import { CoverArtwork } from "@/app/venus/components/cover-artwork/cover-artwork"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import Link from "next/link"

type ArtistAlbumsProps = {
    artist: ArtistWithDetailsDto
}

export const ArtistAlbums = async ({ artist }: ArtistAlbumsProps) => {
    const result = await actionFromFetch(
        venusGetArtistAlbums({
            path: {
                artist_id: artist.id,
            },
        }),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return <ActionErrorMessage result={result} mapper={venusErrorMapper} />
    }

    const albums = result.data

    if (albums.albums.length === 0) {
        return null
    }

    return (
        <div className="flex min-w-0 flex-col">
            <h2 className="sticky top-0 z-10 bg-gray-950 px-3 pb-3 text-lg font-semibold">
                Albums & EPs
            </h2>

            <ScrollArea className="w-full">
                <div className="flex w-36 gap-2 pb-3">
                    {albums.albums.map((album) => (
                        <Link
                            key={album.id}
                            className="pb-2 hover:bg-gray-50/8 active:bg-gray-50/15"
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
            </ScrollArea>
        </div>
    )
}
