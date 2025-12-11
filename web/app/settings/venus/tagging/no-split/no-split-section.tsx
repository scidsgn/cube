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
import { venusGetNoSplitEntries } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { Callout } from "@/app/components/callout/callout"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { InsertNoSplitEntry } from "@/app/settings/venus/tagging/no-split/insert-no-split-entry"
import { NoSplitEntry } from "@/app/settings/venus/tagging/no-split/no-split-entry"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { VenusFetchTags } from "@/app/venus/venus-fetch-tags"

export const NoSplitSection = async () => {
    const result = await actionFromFetch(
        venusGetNoSplitEntries({
            next: {
                tags: [VenusFetchTags.noSplitList],
            },
        }),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return <ActionErrorMessage result={result} mapper={venusErrorMapper} />
    }

    const entries = result.data.entries

    return (
        <SettingsSection name="No-split list">
            <p className="font-medium">
                Artist and band names which contain separator characters like
                commas and ampersands (&) might cause issues on import. Add them
                to the list below to signal to the import algorithm to keep
                those names intact.
            </p>

            <Callout
                variant="warning"
                header="This list affects all track metadata"
            >
                <p>
                    Making changes to this list will require your entire library
                    to be re-scanned for metadata changes.
                </p>
            </Callout>

            <div className="flex flex-col gap-1">
                <InsertNoSplitEntry />

                {entries.length > 0 && (
                    <div className="flex flex-col bg-gray-900">
                        {entries.map((entry) => (
                            <NoSplitEntry key={entry.id} entry={entry} />
                        ))}
                    </div>
                )}
                {entries.length === 0 && (
                    <p className="tracking-sm p-4 text-center text-sm font-medium text-gray-400">
                        No entries added
                    </p>
                )}
            </div>
        </SettingsSection>
    )
}
