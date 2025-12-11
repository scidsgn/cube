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
import { CookiesAdapter } from "@/app/auth/cookies/cookies-adapter"
import { obtainAuthJwt, obtainRefreshToken } from "@/app/auth/tokens"

export const CookieNames = {
    auth: "AuthToken",
    refresh: "RefreshToken",
} as const
export type CookieName = (typeof CookieNames)[keyof typeof CookieNames]

export function getCookies(cookies: CookiesAdapter) {
    return {
        authCookie: cookies.get(CookieNames.auth),
        refreshCookie: cookies.get(CookieNames.refresh),
    }
}

export async function emitCookies(cookies: CookiesAdapter, userId: number) {
    const authJwt = await obtainAuthJwt(userId, "15min")
    if (!authJwt) {
        return
    }

    const refreshToken = await obtainRefreshToken(userId)

    cookies.set({
        name: CookieNames.auth,
        value: authJwt,
        maxAge: "15min",
    })
    cookies.set({
        name: CookieNames.refresh,
        value: refreshToken.externalId,
        maxAge: "7days",
    })
}

export function invalidate(cookies: CookiesAdapter) {
    cookies.clear(CookieNames.auth)
    cookies.clear(CookieNames.refresh)
}
