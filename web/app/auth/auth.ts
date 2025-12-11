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

import { UserRole } from "@/apis/prisma/enums"
import { emitCookies, getCookies, invalidate } from "@/app/auth/cookies"
import { CookiesAdapter } from "@/app/auth/cookies/cookies-adapter"
import {
    createUser,
    getUserByExternalId,
    getUserByUserName,
    setUserPassword,
} from "@/app/auth/db"
import { hashPassword, verifyPassword } from "@/app/auth/password"
import { decodeAuthJwt } from "@/app/auth/tokens"

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

type LoginRequest = {
    userName: string
    password: string
    otp?: string
}

type RegistrationRequest = {
    userName: string
    password: string
    role: UserRole
}

export type UserInfo = {
    id: string
    userName: string
    displayName: string
    role: UserRole
}

export async function authHeaders(
    cookies: CookiesAdapter,
): Promise<HeadersInit> {
    const { authCookie } = getCookies(cookies)
    if (!authCookie) {
        return {}
    }

    return {
        Authorization: `Bearer ${authCookie.value}`,
    }
}

export async function me(cookies: CookiesAdapter): Promise<UserInfo | null> {
    const { authCookie } = getCookies(cookies)
    if (!authCookie) {
        return null
    }

    const payload = decodeAuthJwt(authCookie.value)
    if (!payload || !payload.sub) {
        return null
    }

    const user = await getUserByExternalId(payload.sub)
    if (!user) {
        return null
    }

    return {
        id: user.externalId,
        userName: user.userName,
        displayName: user.displayName,
        role: user.role,
    }
}

export async function login(request: LoginRequest, cookies: CookiesAdapter) {
    const user = await getUserByUserName(request.userName)
    if (!user) {
        return false
    }

    if (!user.passwordHash) {
        const passwordHash = await hashPassword(request.password)

        await setUserPassword(user.id, passwordHash)

        await emitCookies(cookies, user.id)
        return
    }

    if (!(await verifyPassword(request.password, user.passwordHash))) {
        return false
    }

    if (user.otpSecret) {
        if (!request.otp) {
            return "needs otp"
        }
        if (!verifyOtp(request.otp, user.otpSecret)) {
            return false
        }
    }

    await emitCookies(cookies, user.id)
}

export async function logout(cookies: CookiesAdapter) {
    invalidate(cookies)
}

export async function register(
    request: RegistrationRequest,
    cookies: CookiesAdapter,
) {
    const user = await getUserByUserName(request.userName)
    if (user) {
        return false
    }

    const passwordHash = await hashPassword(request.password)
    const newUser = await createUser(
        request.userName,
        passwordHash,
        request.role,
    )

    await emitCookies(cookies, newUser.id)
}

function verifyOtp(otp: string, secret: string): boolean {
    return false
}
