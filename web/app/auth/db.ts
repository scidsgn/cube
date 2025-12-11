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
import { RefreshToken, User, UserRole } from "@/apis/prisma/client"

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

export async function getUserById(id: number): Promise<User | null> {
    return db.user.findFirst({
        where: { id },
    })
}

export async function getUserByUserName(
    userName: string,
): Promise<User | null> {
    return db.user.findFirst({
        where: { userName },
    })
}

export async function getUserByExternalId(
    externalId: string,
): Promise<User | null> {
    return db.user.findFirst({
        where: { externalId },
    })
}

export async function createUser(
    userName: string,
    passwordHash: string,
    role: UserRole,
): Promise<User> {
    return db.user.create({
        data: {
            userName,
            passwordHash,
            role,
            displayName: userName,
            externalId: crypto.randomUUID(),
        },
    })
}

export async function setUserPassword(
    id: number,
    passwordHash: string,
): Promise<User> {
    return db.user.update({
        where: {
            id,
        },
        data: {
            passwordHash,
        },
    })
}

export async function getRefreshTokenByExternalId(
    externalId: string,
): Promise<RefreshToken | null> {
    const refreshToken = await db.refreshToken.findFirst({
        where: { externalId },
    })
    if (!refreshToken) {
        return null
    }

    if (refreshToken.expires.getTime() < Date.now()) {
        await db.refreshToken.delete({ where: { id: refreshToken.id } })
        return null
    }

    return refreshToken
}
