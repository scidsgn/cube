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
import { Button } from "@/app/components/button/button"
import { Callout } from "@/app/components/callout/callout"
import { deleteAccountAction } from "@/app/settings/account/delete-account-action"
import { SettingsSection } from "@/app/settings/components/settings-section"

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

type DeleteAccountSectionProps = {
    userName: string
    isOnlyAdmin: boolean
}

export const DeleteAccountSection = ({
    userName,
    isOnlyAdmin,
}: DeleteAccountSectionProps) => {
    const deleteAccount = useAction(deleteAccountAction, userActionErrorMapper)

    return (
        <SettingsSection name={`Delete @${userName}`}>
            <p className="font-medium">This will remove your access to CUBE.</p>

            {isOnlyAdmin && (
                <Callout header="You cannot delete your account">
                    <p>
                        Your account is the only admin account present in this
                        deployment. Deleting your account would render server
                        maintenance functions inaccessible.
                    </p>
                </Callout>
            )}

            <div className="flex justify-end">
                <Button
                    variant="red"
                    disabled={isOnlyAdmin}
                    ongoing={deleteAccount.ongoing}
                    onClick={deleteAccount.run}
                >
                    Delete account
                </Button>
            </div>
        </SettingsSection>
    )
}
