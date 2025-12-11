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
import { ensureLoggedIn } from "@/app/auth/action-guards"
import { countAdmins } from "@/app/auth/count-users"
import { AdminForm } from "@/app/auth/login/admin-form"
import { LoginForm } from "@/app/auth/login/login-form"
import {
    PageContent,
    PageLayout,
    PageSidebar,
} from "@/app/components/layout/page-layout"
import { redirect } from "next/navigation"

const LoginPage = async () => {
    if (await ensureLoggedIn()) {
        redirect("/")
    }

    const adminCount = await countAdmins()

    if (adminCount === 0) {
        return (
            <PageLayout>
                <PageSidebar className="flex flex-col gap-6">
                    <h1 className="text-2xl font-semibold">
                        Set up admin account
                    </h1>
                </PageSidebar>
                <PageContent>
                    <AdminForm />
                </PageContent>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <PageSidebar className="flex flex-col gap-6">
                <h1 className="text-2xl font-semibold">Log in</h1>
            </PageSidebar>
            <PageContent>
                <LoginForm />
            </PageContent>
        </PageLayout>
    )
}

export default LoginPage
