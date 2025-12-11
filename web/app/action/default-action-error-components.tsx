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
import type { ActionErrorComponents } from "@/app/action/action-error-message"
import { ActionOutcome } from "@/app/action/action-types"
import { IconSymbol } from "@/app/components/icon/icon-symbol"

export const DefaultActionErrorComponents: ActionErrorComponents = {
    [ActionOutcome.forbidden]: (
        <div className="flex items-center gap-3">
            <IconSymbol
                className="bg-red-400 p-1.5 text-gray-950"
                icon="lock"
            />
            <span className="text-xl font-medium text-red-400">
                Access forbidden
            </span>
        </div>
    ),
    [ActionOutcome.notFound]: (
        <div className="flex items-center gap-3">
            <IconSymbol
                className="bg-gray-500 p-1.5 text-gray-950"
                icon="search"
            />
            <span className="text-xl font-medium text-gray-500">
                Item not found
            </span>
        </div>
    ),
    [ActionOutcome.unknownFailure]: (
        <div className="flex items-center gap-3">
            <IconSymbol
                className="bg-red-400 p-1.5 text-gray-950"
                icon="dangerous"
            />
            <span className="text-xl font-medium text-red-400">
                An unknown error occurred
            </span>
        </div>
    ),
    mappedError: (error) => (
        <div className="flex items-center gap-3">
            <IconSymbol
                className="bg-red-400 p-1.5 text-gray-950"
                icon="dangerous"
            />
            <span className="text-xl font-medium text-red-400">{error}</span>
        </div>
    ),
}
