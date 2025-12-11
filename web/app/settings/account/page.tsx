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
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { ActionOutcome } from "@/app/action/action-types"
import { ensureLoggedIn } from "@/app/auth/action-guards"
import { countAdmins } from "@/app/auth/count-users"
import { DeleteAccountSection } from "@/app/settings/account/delete-account-section"

const AccountSettingsPage = async () => {
    const user = await ensureLoggedIn()
    if (!user) {
        return <ActionErrorMessage result={ActionOutcome.forbidden} />
    }

    const adminCount = await countAdmins()
    const isOnlyAdmin = user.role === "ADMIN" && adminCount === 1

    return (
        <>
            <DeleteAccountSection
                userName={user.userName}
                isOnlyAdmin={isOnlyAdmin}
            />
        </>
    )
}

export default AccountSettingsPage
