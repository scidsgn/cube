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
import { UserRole } from "@/apis/prisma/enums"
import { actionDataOf, actionErrorOf } from "@/app/action/action"
import { ActionOutcome } from "@/app/action/action-types"
import { ensureAdmin } from "@/app/auth/action-guards"
import { UserInfo } from "@/app/auth/auth"
import { UserActionError } from "@/app/auth/user-action-errors"
import { revalidatePath } from "next/cache"

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

export type UserDetails = UserInfo & {
    isMe: boolean
    hasOtp: boolean
    hasPassword: boolean
    canDelete: boolean
}

export async function getUsers() {
    const me = await ensureAdmin()
    if (!me) {
        return ActionOutcome.forbidden
    }

    try {
        const users = await db.user.findMany()

        return actionDataOf<UserDetails[]>(
            users.map((user) => ({
                id: user.externalId,
                userName: user.userName,
                displayName: user.displayName,
                role: user.role,
                isMe: user.externalId === me.id,
                hasOtp: user.otpEnabled,
                hasPassword: user.passwordHash !== null,
                canDelete: user.externalId !== me.id,
            })),
        )
    } catch (error) {}

    return ActionOutcome.unknownFailure
}

export async function createUserAction(userName: string) {
    const me = await ensureAdmin()
    if (!me) {
        return ActionOutcome.forbidden
    }

    try {
        const existingUser = await db.user.count({
            where: {
                userName,
            },
        })
        if (existingUser > 0) {
            return actionErrorOf(UserActionError.userNameAlreadyTaken)
        }

        const user = await db.user.create({
            data: {
                userName,
                role: "MEMBER",
                displayName: userName,
                externalId: crypto.randomUUID(),
            },
        })

        revalidatePath("/settings/admin/accounts")

        return ActionOutcome.ok
    } catch (error) {}

    return ActionOutcome.unknownFailure
}

export async function setUserRoleAction(userId: string, role: UserRole) {
    const me = await ensureAdmin()
    if (!me) {
        return ActionOutcome.forbidden
    }
    if (userId === me.id) {
        return actionErrorOf(UserActionError.cannotModifyYourself)
    }

    try {
        await db.user.updateMany({
            where: {
                externalId: userId,
            },
            data: {
                role,
            },
        })

        revalidatePath("/settings/admin/accounts")

        return ActionOutcome.ok
    } catch (error) {}

    return ActionOutcome.unknownFailure
}

export async function resetUserPasswordAction(userId: string) {
    const me = await ensureAdmin()
    if (!me) {
        return ActionOutcome.forbidden
    }
    if (userId === me.id) {
        return actionErrorOf(UserActionError.cannotModifyYourself)
    }

    try {
        await db.user.updateMany({
            where: {
                externalId: userId,
            },
            data: {
                passwordHash: null,
            },
        })

        revalidatePath("/settings/admin/accounts")

        return ActionOutcome.ok
    } catch (error) {}

    return ActionOutcome.unknownFailure
}

export async function deleteUserAction(userId: string) {
    const me = await ensureAdmin()
    if (!me) {
        return ActionOutcome.forbidden
    }
    if (userId === me.id) {
        return actionErrorOf(UserActionError.cannotDeleteYourself)
    }

    try {
        const { count } = await db.user.deleteMany({
            where: {
                externalId: userId,
            },
        })
        if (count !== 1) {
            return ActionOutcome.unknownFailure
        }

        revalidatePath("/settings/admin/accounts")

        return ActionOutcome.ok
    } catch (error) {}

    return ActionOutcome.unknownFailure
}
