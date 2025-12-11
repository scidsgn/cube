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

import type { UserInfo } from "@/app/auth/auth"
import { Dropdown } from "@/app/components/menu/dropdown"
import { logoutAction } from "@/app/header/account-dropdown/logout-action"

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

type AccountDropdownButtonProps = {
    userInfo: UserInfo
}

export const AccountDropdownButton = ({
    userInfo,
}: AccountDropdownButtonProps) => {
    return (
        <Dropdown
            className="grid size-9 place-items-center font-bold"
            menu={[
                {
                    type: "item",
                    name: "Settings",
                    icon: "settings",
                    href: "/settings/general",
                },
                {
                    type: "item",
                    name: "Log out",
                    icon: "logout",
                    onClick: () => logoutAction(),
                },
            ]}
        >
            {userInfo.displayName.substring(0, 1).toUpperCase()}
        </Dropdown>
    )
}
