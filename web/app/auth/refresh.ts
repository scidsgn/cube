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

import { emitCookies, getCookies, invalidate } from "@/app/auth/cookies"
import { CookiesAdapter } from "@/app/auth/cookies/cookies-adapter"
import { getRefreshTokenByExternalId } from "@/app/auth/db"
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

type RefreshOutcome = "no-auth" | "refreshed" | "skip"

export async function refresh(
    cookies: CookiesAdapter,
): Promise<RefreshOutcome> {
    const { authCookie, refreshCookie } = getCookies(cookies)
    if (authCookie && decodeAuthJwt(authCookie.value)) {
        return "skip"
    }

    if (!refreshCookie) {
        return "no-auth"
    }

    const refreshToken = await getRefreshTokenByExternalId(refreshCookie.value)
    if (!refreshToken) {
        invalidate(cookies)
        return "no-auth"
    }

    await emitCookies(cookies, refreshToken.userId)

    return "refreshed"
}
