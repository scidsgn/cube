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
import { venusGetTrack } from "@/apis/venus"
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
import { Duration } from "@/app/components/text/duration"
import { ArtistsList } from "@/app/venus/components/artists-list"
import { CoverArtwork } from "@/app/venus/components/cover-artwork/cover-artwork"
import { TrackCoverArtwork } from "@/app/venus/components/cover-artwork/track-cover-artwork"
import { TrackLyrics } from "@/app/venus/tracks/[id]/track-lyrics"
import { TrackPlaybackButtons } from "@/app/venus/tracks/[id]/track-playback-buttons"
import { TrackWaveformContainer } from "@/app/venus/tracks/[id]/waveform/track-waveform-container"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import Link from "next/link"

const TrackPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const trackId = +(await params).id
    const result = await actionFromFetch(
        venusGetTrack({
            path: {
                track_id: trackId,
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

    const track = result.data

    const artwork = track.disc_track?.disc?.album?.artwork ?? track.artwork

    return (
        <AccentProvider color={artwork?.accent_color}>
            <PageLayout>
                <PageSidebar className="flex flex-col gap-6">
                    {artwork && <TrackCoverArtwork size={256} track={track} />}

                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-semibold">
                            {track.title}
                        </h1>

                        <p className="text-sm font-medium">
                            <Duration>{track.duration}</Duration>
                            <span className="ml-1 text-gray-300">
                                ({Math.round(track.duration)} seconds)
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="font-medium">
                            by{" "}
                            <ArtistsList
                                className="text-accent-500"
                                artists={track.artists}
                            />
                        </p>

                        {track.features.length > 0 && (
                            <p className="font-medium">
                                featuring{" "}
                                <ArtistsList
                                    className="text-accent-500"
                                    artists={track.features}
                                />
                            </p>
                        )}

                        {track.remixers.length > 0 && (
                            <p className="font-medium">
                                remixed by{" "}
                                <ArtistsList
                                    className="text-accent-500"
                                    artists={track.remixers}
                                />
                            </p>
                        )}

                        {track.disc_track && (
                            <p className="font-medium">
                                featured on{" "}
                                <Link
                                    className="text-accent-500"
                                    href={`/venus/albums/${track.disc_track.disc.album.id}`}
                                >
                                    {track.disc_track.disc.album.title}
                                </Link>
                            </p>
                        )}
                    </div>
                </PageSidebar>
                <PageContent className="flex flex-col gap-1">
                    <div className="flex gap-1">
                        <TrackPlaybackButtons track={track} />
                    </div>

                    {track.musical_features && (
                        <div className="grid grid-cols-[auto_1fr] gap-1">
                            <div className="grid grid-rows-3 gap-1">
                                <div className="flex flex-col items-center bg-gray-900 px-3 py-1">
                                    <span className="text-xs font-medium text-gray-300">
                                        Tempo
                                    </span>
                                    <span className="font-mono font-semibold">
                                        {Math.round(track.musical_features.bpm)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center bg-gray-900 px-3 py-1">
                                    <span className="text-xs font-medium text-gray-300">
                                        Key
                                    </span>
                                    <span className="font-mono font-semibold">
                                        {track.musical_features.key}
                                        {track.musical_features.scale ===
                                            "minor" && "m"}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center bg-gray-900 px-3 py-1">
                                    <span className="text-xs font-medium text-gray-300">
                                        Camelot
                                    </span>
                                    <span className="font-mono font-semibold">
                                        {track.musical_features.camelot_index}
                                        {track.musical_features.scale ===
                                        "minor"
                                            ? "A"
                                            : "B"}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-900 px-0.5 py-3">
                                <TrackWaveformContainer track={track} />
                            </div>
                        </div>
                    )}

                    {track.mb_details &&
                        track.mb_details.production_credits.length > 0 && (
                            <div className="mt-4 flex flex-col gap-3">
                                <h2 className="px-2 text-lg font-semibold">
                                    Production & perfomance credits
                                </h2>
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-1">
                                    {track.mb_details.production_credits.map(
                                        (credit, i) => (
                                            <Link
                                                key={i}
                                                className="flex items-center gap-2 pr-2 font-medium hover:bg-gray-50/8 active:bg-gray-50/15"
                                                href={`/venus/artists/${credit.artist.id}`}
                                            >
                                                <CoverArtwork
                                                    size={56}
                                                    artwork={
                                                        credit.artist.artwork
                                                    }
                                                    alt={`${credit.artist.name} avatar`}
                                                />
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate leading-5">
                                                        {credit.artist.name}
                                                    </span>
                                                    <span className="truncate text-xs font-medium text-gray-300">
                                                        {credit.type}
                                                        {credit.description &&
                                                            ` (${credit.description})`}
                                                    </span>
                                                </div>
                                            </Link>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                    {track.mb_details &&
                        track.mb_details.writing_credits.length > 0 && (
                            <div className="mt-4 flex flex-col gap-3">
                                <h2 className="px-2 text-lg font-semibold">
                                    Writing credits
                                </h2>
                                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-1">
                                    {track.mb_details.writing_credits.map(
                                        (artist, i) => (
                                            <Link
                                                key={i}
                                                className="flex items-center gap-2 pr-2 font-medium hover:bg-gray-50/8 active:bg-gray-50/15"
                                                href={`/venus/artists/${artist.id}`}
                                            >
                                                <CoverArtwork
                                                    size={56}
                                                    artwork={artist.artwork}
                                                    alt={`${artist.name} avatar`}
                                                />
                                                <span className="line-clamp-2">
                                                    {artist.name}
                                                </span>
                                            </Link>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                    {track.has_lyrics && <TrackLyrics track={track} />}
                </PageContent>
            </PageLayout>
        </AccentProvider>
    )
}

export default TrackPage
