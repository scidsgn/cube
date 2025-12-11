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

import {
    venusCreateNoSplitEntry,
    venusDeleteNoSplitEntry,
    venusUpdateNoSplitEntry,
} from "@/apis/venus"
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

export async function insertNoSplitEntryAction(name: string) {
    const { error, response } = await venusCreateNoSplitEntry({
        body: {
            name,
        },
    })
    const result = actionFromResponse(response, error?.code)

    if (result === ActionOutcome.ok) {
        revalidateTag(VenusFetchTags.noSplitList, "max")
    }

    return result
}

export async function deleteNoSplitEntryAction(entryId: number) {
    const { error, response } = await venusDeleteNoSplitEntry({
        path: {
            entry_id: entryId,
        },
    })
    const result = actionFromResponse(response, error?.code)

    if (result === ActionOutcome.ok) {
        revalidateTag(VenusFetchTags.noSplitList, "max")
    }

    return result
}

export async function updateNoSplitEntryAction(entryId: number, name: string) {
    const { error, response } = await venusUpdateNoSplitEntry({
        path: {
            entry_id: entryId,
        },
        body: {
            name: name,
        },
    })
    const result = actionFromResponse(response, error?.code)

    if (result === ActionOutcome.ok) {
        revalidateTag(VenusFetchTags.noSplitList, "max")
    }

    return result
}
