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
import { ScanDto, VenusErrorCode } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionOutcome, ActionResultWithData } from "@/app/action/action-types"
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { LoadingIcon } from "@/app/components/icon/loading-icon"
import { DateTime } from "@/app/components/text/date-time"

type ScanDetailsProps = {
    result: ActionResultWithData<ScanDto, VenusErrorCode>
}

export const ScanDetails = ({ result }: ScanDetailsProps) => {
    if (result === ActionOutcome.notFound) {
        return (
            <>
                <div className="flex items-center gap-3">
                    <IconSymbol
                        className="bg-gray-500 p-1.5 text-gray-950"
                        icon="flare"
                    />
                    <span className="text-xl font-medium">Not scanned yet</span>
                </div>
                <p className="text-sm font-medium">
                    Start a scan to import your tracks to the library.
                </p>
            </>
        )
    }

    if (actionFailed(result)) {
        return (
            <>
                <div className="flex items-center gap-3">
                    <IconSymbol
                        className="bg-red-400 p-1.5 text-gray-950"
                        icon="close"
                    />
                    <span className="text-xl font-medium text-red-400">
                        Could not retrieve latest scan
                    </span>
                </div>
                <p className="text-sm font-medium">
                    Check if CUBE is deployed properly.
                </p>
            </>
        )
    }

    const scan = result.data

    if (scan.status === "failed") {
        return (
            <>
                <div className="flex items-center gap-3">
                    <IconSymbol
                        className="bg-red-400 p-1.5 text-gray-950"
                        icon="close"
                    />
                    <span className="text-xl font-medium text-red-400">
                        Most recent scan has failed
                    </span>
                </div>

                <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 text-sm font-medium">
                    <span className="text-gray-300">Scan started on</span>
                    <span>
                        <DateTime date={new Date(scan.enqueued_at)} />
                    </span>
                    <span className="text-gray-300">Scan ended on</span>
                    <span>
                        <DateTime date={new Date(scan.ended_at!)} />
                    </span>
                </div>
            </>
        )
    }

    if (scan.status === "interrupted") {
        return (
            <>
                <div className="flex items-center gap-3">
                    <IconSymbol
                        className="bg-red-400 p-1.5 text-gray-950"
                        icon="close"
                    />
                    <span className="text-xl font-medium text-red-400">
                        Scan was interrupted
                    </span>
                </div>

                <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 text-sm font-medium">
                    <span className="text-gray-300">Scan started on</span>
                    <span>
                        <DateTime date={new Date(scan.enqueued_at)} />
                    </span>
                    <span className="text-gray-300">Scan ended on</span>
                    <span>
                        <DateTime date={new Date(scan.ended_at!)} />
                    </span>
                </div>
            </>
        )
    }

    if (scan.status === "completed") {
        return (
            <>
                <div className="flex items-center gap-3">
                    <IconSymbol
                        className="bg-green-400 p-1.5 text-gray-950"
                        icon="check"
                    />
                    <span className="text-xl font-medium text-green-400">
                        Most recent scan was successful
                    </span>
                </div>

                <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 text-sm font-medium">
                    <span className="text-gray-300">Scan started on</span>
                    <span>
                        <DateTime date={new Date(scan.enqueued_at)} />
                    </span>
                    <span className="text-gray-300">Scan ended on</span>
                    <span>
                        <DateTime date={new Date(scan.ended_at!)} />
                    </span>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex items-center gap-3">
                <LoadingIcon className="bg-gray-500 p-1.5 text-gray-950" />
                <span className="text-xl font-medium">Scan in progress</span>
            </div>

            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 text-sm font-medium">
                <span className="text-gray-300">Scan started on</span>
                <span>
                    <DateTime date={new Date(scan.enqueued_at)} />
                </span>
            </div>
        </>
    )
}
