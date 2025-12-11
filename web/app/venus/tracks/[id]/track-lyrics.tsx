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
import { TrackDto, venusGetTrackLyrics } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { Duration } from "@/app/components/text/duration"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"

type TrackLyricsProps = {
    track: TrackDto
}

export const TrackLyrics = async ({ track }: TrackLyricsProps) => {
    const result = await actionFromFetch(
        venusGetTrackLyrics({
            path: {
                track_id: track.id,
            },
        }),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return <ActionErrorMessage result={result} mapper={venusErrorMapper} />
    }

    const lyrics = result.data

    if (lyrics.synced_lyrics) {
        return (
            <div className="mt-4 flex flex-col gap-3">
                <h2 className="px-3 text-lg font-semibold">Synced lyrics</h2>

                <div className="flex flex-col gap-1">
                    {lyrics.synced_lyrics.lines.map((line, i) => (
                        <div key={i} className="px-3">
                            <span className="tracking-sm text-sm font-medium text-gray-400">
                                <Duration>{line.start}</Duration>
                            </span>
                            <p className="text-xl font-medium">{line.line}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (lyrics.plain_lyrics) {
        return (
            <div className="mt-4 flex flex-col gap-3">
                <h2 className="px-3 text-lg font-semibold">Lyrics</h2>

                <div className="flex flex-col gap-1">
                    {lyrics.plain_lyrics.split("\n").map((line, i) => (
                        <p key={i} className="px-3 text-xl font-medium">
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        )
    }

    return null
}
