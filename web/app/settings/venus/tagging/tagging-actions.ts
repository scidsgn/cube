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

"use server"

import { venusUpdateScanSettings } from "@/apis/venus"
import { actionFromResponse } from "@/app/action/action"
import { ActionOutcome } from "@/app/action/action-types"
import { VenusFetchTags } from "@/app/venus/venus-fetch-tags"
import { revalidateTag } from "next/cache"

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

export async function updateArtistSplittingAction(split: boolean) {
    const { response, error } = await venusUpdateScanSettings({
        body: {
            split_artists: split,
        },
    })
    const result = actionFromResponse(response, error?.code)

    if (result === ActionOutcome.ok) {
        revalidateTag(VenusFetchTags.scanSettings, "max")
    }

    return result
}

export async function updateTrackFeaturesAction(extract: boolean) {
    const { response, error } = await venusUpdateScanSettings({
        body: {
            extract_track_features: extract,
        },
    })
    const result = actionFromResponse(response, error?.code)

    if (result === ActionOutcome.ok) {
        revalidateTag(VenusFetchTags.scanSettings, "max")
    }

    return result
}
