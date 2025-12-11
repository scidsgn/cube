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

"use server"

import { db } from "@/apis/db"
import { actionErrorOf } from "@/app/action/action"
import { ActionOutcome } from "@/app/action/action-types"
import { ensureLoggedIn } from "@/app/auth/action-guards"
import { countAdmins } from "@/app/auth/count-users"
import { UserActionError } from "@/app/auth/user-action-errors"
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

export async function deleteAccountAction() {
    const user = await ensureLoggedIn()
    if (!user) {
        return ActionOutcome.forbidden
    }

    if (user.role === "ADMIN") {
        const adminCount = await countAdmins()
        if (adminCount === 1) {
            return actionErrorOf(UserActionError.cannotRemoveOnlyAdmin)
        }
    }

    try {
        const { count } = await db.user.deleteMany({
            where: {
                externalId: user.id,
            },
        })
        if (count !== 1) {
            return ActionOutcome.unknownFailure
        }
    } catch (_error) {
        return ActionOutcome.unknownFailure
    }

    await logoutAction()

    return ActionOutcome.ok
}
