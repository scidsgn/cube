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

import { useAction } from "@/app/action/use-action"
import { userActionErrorMapper } from "@/app/auth/user-action-errors"
import { Dropdown } from "@/app/components/menu/dropdown"
import { Menu } from "@/app/components/menu/menu-types"
import {
    UserDetails,
    deleteUserAction,
    resetUserPasswordAction,
    setUserRoleAction,
} from "@/app/settings/admin/accounts/users-actions"

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

type UsersItemProps = {
    user: UserDetails
}

export const UsersItem = ({ user }: UsersItemProps) => {
    const deleteUser = useAction(deleteUserAction, userActionErrorMapper)
    const setUserRole = useAction(setUserRoleAction, userActionErrorMapper)
    const resetUserPassword = useAction(
        resetUserPasswordAction,
        userActionErrorMapper,
    )

    const menuItems = [
        user.role === "ADMIN" &&
            !user.isMe && {
                type: "item",
                name: "Downgrade to member",
                icon: "arrow_downward",
                onClick: () => setUserRole.run(user.id, "MEMBER"),
            },
        user.role === "MEMBER" &&
            !user.isMe && {
                type: "item",
                name: "Upgrade to admin",
                icon: "arrow_upward",
                onClick: () => setUserRole.run(user.id, "ADMIN"),
            },

        user.canDelete &&
            user.hasPassword && {
                type: "item",
                name: "Reset password",
                icon: "refresh",
                onClick: () => resetUserPassword.run(user.id),
            },

        user.canDelete && {
            type: "item",
            name: "Delete account",
            icon: "delete",
            onClick: () => deleteUser.run(user.id),
        },
    ]
        .filter(Boolean)
        .flat() as Menu

    return (
        <div className="flex items-center gap-2 border-gray-700 p-3 not-last-of-type:border-b-2">
            <div className="flex min-w-0 grow gap-2 px-3">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="truncate font-medium text-gray-300">
                    @{user.userName}
                </span>
            </div>

            <div className="flex shrink-0 gap-1">
                {user.role === "ADMIN" && (
                    <div className="tracking-sm bg-accent-500 px-2 py-1 text-sm font-semibold text-gray-950 uppercase">
                        Admin
                    </div>
                )}
                {user.role === "MEMBER" && (
                    <div className="tracking-sm bg-gray-500 px-2 py-1 text-sm font-semibold text-gray-950 uppercase">
                        Member
                    </div>
                )}

                {user.hasOtp && (
                    <div className="tracking-sm bg-gray-500 px-2 py-1 text-sm font-semibold text-gray-950 uppercase">
                        2FA
                    </div>
                )}

                {!user.hasPassword && (
                    <div className="tracking-sm bg-red-400 px-2 py-1 text-sm font-semibold text-gray-950 uppercase">
                        Not set up
                    </div>
                )}
            </div>

            <div className="size-9 shrink-0">
                {menuItems.length > 0 && (
                    <Dropdown
                        ongoing={
                            deleteUser.ongoing ||
                            setUserRole.ongoing ||
                            resetUserPassword.ongoing
                        }
                        menu={menuItems}
                        icon="more_horiz"
                    />
                )}
            </div>
        </div>
    )
}
