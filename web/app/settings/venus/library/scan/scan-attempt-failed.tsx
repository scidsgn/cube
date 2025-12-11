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
import { IconSymbol } from "@/app/components/icon/icon-symbol"

export const ScanAttemptFailed = () => {
    return (
        <>
            <div className="flex items-center gap-3">
                <IconSymbol
                    className="bg-red-400 p-1.5 text-gray-950"
                    icon="close"
                />
                <span className="text-xl font-medium text-red-400">
                    Scan attempt failed
                </span>
            </div>
            <p className="text-sm font-medium">
                Check if CUBE is deployed properly.
            </p>
        </>
    )
}
