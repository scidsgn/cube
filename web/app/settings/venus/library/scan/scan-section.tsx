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

"use client"

import { ScanStatus } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionOutcome } from "@/app/action/action-types"
import { Callout } from "@/app/components/callout/callout"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { fetchRecentScan } from "@/app/settings/venus/library/scan/fetch-recent-scan"
import { ScanAttemptFailed } from "@/app/settings/venus/library/scan/scan-attempt-failed"
import {
    InterruptScanButton,
    ScanButton,
} from "@/app/settings/venus/library/scan/scan-button"
import { ScanDetails } from "@/app/settings/venus/library/scan/scan-details"
import { ScanStepList } from "@/app/settings/venus/library/scan/scan-step-list"
import { useState } from "react"
import useSWR from "swr"

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

export const ScanSection = () => {
    const [scanAttemptFailed, setScanAttemptFailed] = useState(false)
    const { data, error, isLoading, mutate } = useSWR(
        "venus-recent-library-scan",
        () => fetchRecentScan(),
        {
            refreshInterval: (data) => {
                if (!data || actionFailed(data)) {
                    return 0
                }

                const isOngoing = !isStatusTerminal(data.data.status)

                return isOngoing ? 1000 : 0
            },
        },
    )

    const scan = data && !actionFailed(data) ? data.data : null
    const isOngoing = (scan && !isStatusTerminal(scan?.status)) || false

    return (
        <SettingsSection name="Current status">
            <div className="flex items-start gap-6">
                <div className="flex min-w-0 grow flex-col gap-2">
                    {!isLoading && (
                        <>
                            {scanAttemptFailed && <ScanAttemptFailed />}
                            {!scanAttemptFailed && (
                                <>
                                    <ScanDetails
                                        result={
                                            !data || error
                                                ? ActionOutcome.unknownFailure
                                                : data
                                        }
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
                {isOngoing ? (
                    <InterruptScanButton mutate={mutate} />
                ) : (
                    <ScanButton mutate={mutate} />
                )}
            </div>
            {scan && !scanAttemptFailed && <ScanStepList scan={scan} />}

            <Callout header="Before you scan" variant="info">
                <p>
                    Make sure the Tagging and Analysis settings match your
                    preferences. If your library contains hundreds of songs,
                    performing a rescan to correct any import mistakes may take
                    a long time.
                </p>
            </Callout>
        </SettingsSection>
    )
}

export function isStatusTerminal(status: ScanStatus | null | undefined) {
    if (!status) {
        return false
    }
    const terminalStatuses: ScanStatus[] = [
        "completed",
        "failed",
        "interrupted",
    ]

    return terminalStatuses.includes(status)
}
