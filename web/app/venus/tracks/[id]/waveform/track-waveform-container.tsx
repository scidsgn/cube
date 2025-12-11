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
import { TrackDto, venusGetTrackWaveform } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { actionFromFetch } from "@/app/action/fetch-action"
import { TrackWaveform } from "@/app/venus/tracks/[id]/waveform/track-waveform"

type TrackWaveformContainerProps = {
    track: TrackDto
}

export const TrackWaveformContainer = async ({
    track,
}: TrackWaveformContainerProps) => {
    const result = await actionFromFetch(
        venusGetTrackWaveform({
            path: {
                track_id: track.id,
            },
        }),
    )
    if (actionFailed(result)) {
        return null
    }

    const waveform = result.data

    return <TrackWaveform track={track} waveform={waveform?.waveform ?? []} />
}
