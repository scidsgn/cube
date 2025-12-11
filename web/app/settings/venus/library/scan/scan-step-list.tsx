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
import { OngoingOperationStatus, ScanDto } from "@/apis/venus"
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { IconType } from "@/app/components/icon/icon-type"

type ScanStepListProps = {
    scan: ScanDto
}

export const ScanStepList = ({ scan }: ScanStepListProps) => {
    return (
        <div className="flex flex-col gap-0.5 pt-2">
            {scan.tracks_import && (
                <div className="flex min-w-0 items-center gap-1.5 bg-gray-900 px-2.5 py-1.5 text-sm font-medium">
                    <IconSymbol
                        icon={ongoingOperationStatusIcon(
                            scan.tracks_import.status,
                        )}
                        size={20}
                    />
                    <span className="truncate">
                        Importing tracks: {scan.tracks_import.upserted_tracks}{" "}
                        added/updated, {scan.tracks_import.deleted_tracks}{" "}
                        removed
                    </span>
                </div>
            )}
            {scan.musical_estimations && (
                <div className="flex min-w-0 items-center gap-1.5 bg-gray-900 px-2.5 py-1.5 text-sm font-medium">
                    <IconSymbol
                        icon={ongoingOperationStatusesIcon(
                            scan.musical_estimations.map((job) => job.status),
                        )}
                        size={20}
                    />
                    <span className="truncate">
                        Estimating musical features:{" "}
                        {scan.musical_estimations.length} enqueued,{" "}
                        {
                            scan.musical_estimations.filter(
                                (job) => job.status === "completed",
                            ).length
                        }{" "}
                        completed
                    </span>
                </div>
            )}
            {scan.lyrics && (
                <div className="flex min-w-0 items-center gap-1.5 bg-gray-900 px-2.5 py-1.5 text-sm font-medium">
                    <IconSymbol
                        icon={ongoingOperationStatusesIcon(
                            scan.lyrics.map((job) => job.status),
                        )}
                        size={20}
                    />
                    <span className="truncate">
                        Fetching lyrics: {scan.lyrics.length} enqueued,{" "}
                        {
                            scan.lyrics.filter(
                                (job) => job.status === "completed",
                            ).length
                        }{" "}
                        completed
                    </span>
                </div>
            )}
        </div>
    )
}

function ongoingOperationStatusIcon(status: OngoingOperationStatus): IconType {
    switch (status) {
        case "enqueued":
            return "schedule"
        case "started":
            return "hourglass"
        case "completed":
            return "check"
        case "failed":
        case "skipped":
            return "close"
    }
}

function ongoingOperationStatusesIcon(
    statuses: OngoingOperationStatus[],
): IconType {
    if (statuses.every((s) => s === "enqueued")) {
        return "schedule"
    }
    if (statuses.every((s) => s === "completed")) {
        return "check"
    }

    if (statuses.some((s) => s === "failed")) {
        return "close"
    }

    return "hourglass"
}
