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
import { venusGetScanSettings } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { adminPage } from "@/app/auth/admin-page"
import { ArtistSplittingSection } from "@/app/settings/venus/tagging/artist-splitting/artist-splitting-section"
import { NoSplitSection } from "@/app/settings/venus/tagging/no-split/no-split-section"
import { TrackFeaturesSection } from "@/app/settings/venus/tagging/track-features/track-features-section"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"

const VenusTaggingSettingsPage = adminPage(async () => {
    const result = await actionFromFetch(
        venusGetScanSettings(),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return <ActionErrorMessage result={result} mapper={venusErrorMapper} />
    }

    const settings = result.data

    return (
        <>
            <TrackFeaturesSection settings={settings} />
            <ArtistSplittingSection settings={settings} />
            {settings.split_artists && <NoSplitSection />}
        </>
    )
})

export default VenusTaggingSettingsPage
