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
import { getUserByExternalId } from "@/app/auth/db"

type PlaylistUserProps = {
    userId: string
}

export const PlaylistUser = async ({ userId }: PlaylistUserProps) => {
    const user = await getUserByExternalId(userId)
    if (!user) {
        return (
            <div className="flex min-w-0 items-center gap-2">
                <span className="tracking-sm text-sm font-medium text-gray-400 uppercase">
                    by
                </span>
                <div className="grid size-6 place-items-center bg-gray-700 font-bold">
                    ?
                </div>
                <span className="grow truncate font-medium">???</span>
            </div>
        )
    }

    return (
        <div className="flex min-w-0 items-center gap-2">
            <span className="tracking-sm text-sm font-medium text-gray-400 uppercase">
                by
            </span>
            <div className="grid size-6 place-items-center bg-gray-700 font-bold">
                {user.userName.trim().substring(0, 1).toUpperCase()}
            </div>
            <span className="grow truncate font-medium">@{user.userName}</span>
        </div>
    )
}
