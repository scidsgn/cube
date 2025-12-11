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
import { venusGetArtist } from "@/apis/venus"
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
import { Tab, Tabs } from "@/app/components/tabs/tabs"
import { ArtistAlbums } from "@/app/venus/artists/[id]/artist-albums"
import { ArtistButtons } from "@/app/venus/artists/[id]/artist-buttons"
import { ArtistFeatures } from "@/app/venus/artists/[id]/artist-features"
import { ArtistRemixes } from "@/app/venus/artists/[id]/artist-remixes"
import { ArtistTracks } from "@/app/venus/artists/[id]/artist-tracks"
import { CoverArtwork } from "@/app/venus/components/cover-artwork/cover-artwork"
import { TracklistHeader } from "@/app/venus/components/tracklist/tracklist-header"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"

const ArtistPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const artistId = +(await params).id
    const result = await actionFromFetch(
        venusGetArtist({
            path: {
                artist_id: artistId,
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

    const artist = result.data

    return (
        <AccentProvider color={artist.artwork?.accent_color}>
            <PageLayout>
                <PageSidebar className="flex flex-col gap-6">
                    {artist.artwork && (
                        <CoverArtwork
                            size={256}
                            artwork={artist.artwork}
                            alt={`${artist.name} avatar`}
                        />
                    )}

                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl font-semibold">
                            {artist.name}
                        </h1>

                        <ArtistButtons />
                    </div>
                </PageSidebar>
                <PageContent className="flex flex-col gap-2">
                    <ArtistAlbums artist={artist} />

                    {artist.track_count +
                        artist.feature_count +
                        artist.remix_count >
                        0 && (
                        <Tabs
                            className="flex flex-col"
                            listClassName="bg-gray-950"
                            defaultValue={
                                [
                                    artist.track_count && "tracks",
                                    artist.feature_count && "features",
                                    artist.remix_count && "remixes",
                                ].filter(Boolean)[0]! || ""
                            }
                        >
                            {artist.track_count > 0 && (
                                <Tab value="tracks" button="Tracks">
                                    <TracklistHeader
                                        className="sticky top-9.5 z-10 bg-gray-950 pt-2"
                                        columns={[
                                            "artists",
                                            "album",
                                            "tempo",
                                            "key",
                                        ]}
                                    />
                                    <ArtistTracks artist={artist} />
                                </Tab>
                            )}
                            {artist.feature_count > 0 && (
                                <Tab value="features" button="Features">
                                    <TracklistHeader
                                        className="sticky top-9.5 z-10 bg-gray-950 pt-2"
                                        columns={[
                                            "artists",
                                            "album",
                                            "tempo",
                                            "key",
                                        ]}
                                    />
                                    <ArtistFeatures artist={artist} />
                                </Tab>
                            )}
                            {artist.remix_count > 0 && (
                                <Tab value="remixes" button="Remixes">
                                    <TracklistHeader
                                        className="sticky top-9.5 z-10 bg-gray-950 pt-2"
                                        columns={[
                                            "artists",
                                            "album",
                                            "tempo",
                                            "key",
                                        ]}
                                    />
                                    <ArtistRemixes artist={artist} />
                                </Tab>
                            )}
                        </Tabs>
                    )}
                </PageContent>
            </PageLayout>
        </AccentProvider>
    )
}

export default ArtistPage
