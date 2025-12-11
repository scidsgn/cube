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
import { ensureAdmin } from "@/app/auth/action-guards"
import { SettingsSideLink } from "@/app/settings/components/settings-side-link"

export const SettingsAdminLinks = async () => {
    const adminUser = await ensureAdmin()
    if (!adminUser) {
        return null
    }

    return (
        <div className="flex flex-col gap-0.5">
            <span className="tracking-sm px-2 text-sm font-medium text-gray-400">
                Server Management
            </span>
            <SettingsSideLink href="/settings/admin/accounts" icon="groups_3">
                Users & Invites
            </SettingsSideLink>
        </div>
    )
}
