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

import {
    AlbumDiscDto,
    AlbumDto,
    AlbumTrackDto,
    venusGetAlbum,
} from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { FullPageActionErrorComponents } from "@/app/action/full-action-error-component"
import { AccentProvider } from "@/app/components/accent/accent-provider"
import {
    PageContent,
    PageLayout,
    PageSidebar,
} from "@/app/components/layout/page-layout"
import { AlbumPlaybackButtons } from "@/app/venus/albums/[id]/album-playback-buttons"
import { ArtistsList } from "@/app/venus/components/artists-list"
import { CoverArtwork } from "@/app/venus/components/cover-artwork/cover-artwork"
import { TracklistHeader } from "@/app/venus/components/tracklist/tracklist-header"
import { TracklistItem } from "@/app/venus/components/tracklist/tracklist-item"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { Fragment } from "react"
import {
    PlayerTrack,
    trackMusicalFeaturesDtoToPlayerModel,
} from "@/app/venus/playback/player-track-types"
import { TracklistProvider } from "@/app/venus/components/tracklist/tracklist-context"

const AlbumPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const albumId = +(await params).id
    const result = await actionFromFetch(
        venusGetAlbum({
            path: {
                album_id: albumId,
            },
        }),
        (err) => err.code,
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

    const album = result.data

    const albumTracks = album.discs.flatMap((disc) =>
        disc.tracks.map((discTrack) =>
            albumTrackToPlayerTrack(discTrack, disc, album),
        ),
    )

    return (
        <AccentProvider color={album.artwork?.accent_color}>
            <PageLayout>
                <PageSidebar className="flex flex-col gap-6">
                    <CoverArtwork
                        size={256}
                        artwork={album.artwork}
                        alt={`${album.title} cover art`}
                    />

                    <div className="flex min-w-0 grow flex-col gap-1">
                        <h1 className="-my-1 w-full pb-2 text-3xl font-semibold wrap-break-word">
                            {album.title}
                        </h1>

                        <p className="text-lg font-medium">
                            <ArtistsList
                                artists={album.artists}
                                className="text-accent-400"
                            />
                        </p>

                        <p className="text-sm font-medium text-gray-400 uppercase tabular-nums">
                            {album.mb_details?.release_type ?? "Album"}
                            {album.release_year
                                ? ` - ${album.release_year}`
                                : ""}
                        </p>
                    </div>

                    <AlbumPlaybackButtons album={album} />
                </PageSidebar>
                <PageContent className="flex flex-col">
                    <TracklistProvider tracks={albumTracks}>
                        {album.discs.map((disc) => (
                            <Fragment key={disc.id}>
                                {album.discs.length > 1 && (
                                    <header className="px-3 pb-1 text-lg font-semibold not-first-of-type:pt-6">
                                        Disc {disc.disc_number}
                                    </header>
                                )}

                                <div className="sticky top-0 z-50 flex flex-col gap-2 bg-gray-950">
                                    <TracklistHeader
                                        columns={["artists", "tempo", "key"]}
                                        showTrackNumber
                                    />
                                </div>

                                <div
                                    key={disc.id}
                                    className="flex flex-col gap-0.5"
                                >
                                    {disc.tracks.map((track) => (
                                        <TracklistItem
                                            key={track.id}
                                            track={albumTrackToPlayerTrack(
                                                track,
                                                disc,
                                                album,
                                            )}
                                            columns={[
                                                "artists",
                                                "tempo",
                                                "key",
                                            ]}
                                            showTrackNumber
                                        />
                                    ))}
                                </div>
                            </Fragment>
                        ))}
                    </TracklistProvider>
                </PageContent>
            </PageLayout>
        </AccentProvider>
    )
}

export default AlbumPage

function albumTrackToPlayerTrack(
    track: AlbumTrackDto,
    disc: AlbumDiscDto,
    album: AlbumDto,
): PlayerTrack {
    return {
        ...track,
        artwork: track.artwork || undefined,
        album: {
            id: album.id,
            title: album.title,
            discNumber: disc.disc_number,
            trackCount: disc.track_count,
            trackNumber: track.track_number,
            trackNumberSuffix: track.track_number_suffix,
        },
        musicalFeatures: trackMusicalFeaturesDtoToPlayerModel(
            track.musical_features,
        ),
    }
}
