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
import { MiddlewareCookiesAdapter } from "@/app/auth/cookies/middleware-cookies-adapter"
import { refresh } from "@/app/auth/refresh"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
    const response = NextResponse.next()
    const cookieStore = new MiddlewareCookiesAdapter(
        request.cookies,
        response.cookies,
    )

    const outcome = await refresh(cookieStore)
    if (outcome === "no-auth") {
        const url = request.nextUrl.clone()
        url.searchParams.set("redirect", url.pathname)
        url.pathname = "/auth/login"

        return NextResponse.redirect(url)
    }

    return response
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|auth|.*\\.png$).*)"],
}
