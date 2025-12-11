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
import { venusGetMusicbrainzSettings } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { MusicbrainzSection } from "@/app/settings/venus/external/musicbrainz/musicbrainz-section"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { VenusFetchTags } from "@/app/venus/venus-fetch-tags"

export const MusicbrainzSectionContainer = async () => {
    const result = await actionFromFetch(
        venusGetMusicbrainzSettings({
            next: {
                tags: [VenusFetchTags.musicbrainzSettings],
            },
        }),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return <ActionErrorMessage result={result} mapper={venusErrorMapper} />
    }

    const settings = result.data

    return <MusicbrainzSection settings={settings} />
}
