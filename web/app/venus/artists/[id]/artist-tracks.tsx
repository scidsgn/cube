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
import { ArtistWithDetailsDto, venusGetArtistTracks } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { TracklistItem } from "@/app/venus/components/tracklist/tracklist-item"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"

type ArtistTracksProps = {
    artist: ArtistWithDetailsDto
}

export const ArtistTracks = async ({ artist }: ArtistTracksProps) => {
    const result = await actionFromFetch(
        venusGetArtistTracks({
            path: {
                artist_id: artist.id,
            },
        }),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return <ActionErrorMessage result={result} mapper={venusErrorMapper} />
    }

    const tracks = result.data

    return (
        <div className="flex flex-col gap-0.5">
            {tracks.tracks.map((track) => (
                <TracklistItem
                    key={track.id}
                    track={track}
                    columns={["artists", "album", "tempo", "key"]}
                />
            ))}
        </div>
    )
}
