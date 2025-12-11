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
import {
    PageContent,
    PageLayout,
    PageSidebar,
} from "@/app/components/layout/page-layout"
import { SettingsSideLink } from "@/app/settings/components/settings-side-link"
import { SettingsAdminLinks } from "@/app/settings/settings-admin-links"
import { VenusAdminLinks } from "@/app/settings/venus/venus-admin-links"
import { ReactNode } from "react"

const SettingsLayout = ({ children }: { children?: ReactNode }) => {
    return (
        <PageLayout>
            <PageSidebar className="flex flex-col gap-3">
                <h1 className="text-2xl font-semibold">Settings</h1>

                <div className="flex flex-col gap-0.5">
                    <SettingsSideLink href="/settings/general" icon="interests">
                        General
                    </SettingsSideLink>
                    <SettingsSideLink
                        href="/settings/account"
                        icon="person_shield"
                    >
                        Account
                    </SettingsSideLink>
                    <SettingsSideLink href="/settings/about" icon="info">
                        About
                    </SettingsSideLink>
                </div>

                <SettingsAdminLinks />

                <VenusAdminLinks />
            </PageSidebar>
            <PageContent className="flex flex-col gap-8">
                {children}
            </PageContent>
        </PageLayout>
    )
}

export default SettingsLayout
