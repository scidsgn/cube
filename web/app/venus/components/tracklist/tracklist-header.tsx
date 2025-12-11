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

import {
    TracklistColumn,
    tracklistColumnsToGridTemplate,
} from "@/app/venus/components/tracklist/tracklist-column"
import { Fragment, ReactNode } from "react"

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

type TracklistHeaderProps = {
    className?: string
    columns: TracklistColumn[]
    showTrackNumber?: boolean
}

export const TracklistHeader = ({
    className,
    columns,
    showTrackNumber,
}: TracklistHeaderProps) => {
    const columnMarkup: Record<TracklistColumn, ReactNode> = {
        artists: <span>Artist</span>,
        album: <span>Album</span>,
        tempo: <span>Tempo</span>,
        key: <span>Key</span>,
    }

    return (
        <div className={className}>
            <div
                className="tracking-sm grid h-6 items-center gap-2 bg-gray-950 text-xs font-semibold text-gray-500"
                style={{
                    gridTemplateColumns: `36px 1.5fr ${tracklistColumnsToGridTemplate(columns)} 64px 36px`,
                }}
            >
                <span className="text-center">{showTrackNumber && "#"}</span>
                <span>Title</span>
                {columns.map((column) => (
                    <Fragment key={column}>{columnMarkup[column]}</Fragment>
                ))}
                <span className="pr-3 text-right">Duration</span>
                <div className="flex justify-end" />
            </div>
        </div>
    )
}
