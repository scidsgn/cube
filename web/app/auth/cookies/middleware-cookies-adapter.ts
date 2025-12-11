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
import {
    CookieRequest,
    CookiesAdapter,
} from "@/app/auth/cookies/cookies-adapter"
import ms from "ms"
import {
    RequestCookies,
    ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies"

export class MiddlewareCookiesAdapter extends CookiesAdapter {
    #requestCookies: RequestCookies
    #responseCookies: ResponseCookies

    constructor(
        requestCookies: RequestCookies,
        responseCookies: ResponseCookies,
    ) {
        super()
        this.#requestCookies = requestCookies
        this.#responseCookies = responseCookies
    }

    get(name: string) {
        const cookie = this.#requestCookies.get(name)
        if (!cookie) {
            return null
        }

        return cookie
    }

    set(cookie: CookieRequest) {
        this.#responseCookies.set({
            name: cookie.name,
            value: cookie.value,
            maxAge: ms(cookie.maxAge) / 1000,
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        })
    }
}
