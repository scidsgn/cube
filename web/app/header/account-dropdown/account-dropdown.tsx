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
import { me } from "@/app/auth/auth"
import { ReadonlyRequestCookiesAdapter } from "@/app/auth/cookies/readonly-request-cookies-adapter"
import { Dropdown } from "@/app/components/menu/dropdown"
import { AccountDropdownButton } from "@/app/header/account-dropdown/account-dropdown-button"
import { cookies } from "next/headers"

export const AccountDropdown = async () => {
    const user = await me(new ReadonlyRequestCookiesAdapter(await cookies()))
    if (!user) {
        return (
            <Dropdown
                menu={[
                    {
                        type: "item",
                        name: "Log in",
                        icon: "login",
                        href: "/auth/login",
                    },
                ]}
                icon="key"
            />
        )
    }

    return <AccountDropdownButton userInfo={user} />
}
