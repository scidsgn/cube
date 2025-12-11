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
import { VenusGetCoverArtData } from "@/apis/venus"
import { buildUrl } from "@/apis/venus/client/utils.gen"
import { getCookies } from "@/app/auth/cookies"
import { ReadonlyRequestCookiesAdapter } from "@/app/auth/cookies/readonly-request-cookies-adapter"
import { env } from "@/app/env"
import { cookies } from "next/headers"

export async function GET(
    _request: Request,
    context: RouteContext<"/venus/api/cover-arts/[id]">,
) {
    const { id } = await context.params

    const idAsNumber = +id
    if (Number.isNaN(idAsNumber)) {
        return new Response("", { status: 404 })
    }

    const cookieStore = new ReadonlyRequestCookiesAdapter(await cookies())
    const { authCookie } = getCookies(cookieStore)

    const params: VenusGetCoverArtData = {
        path: {
            cover_art_id: idAsNumber,
        },
        url: "/library/cover-arts/{cover_art_id}",
    }
    const url = buildUrl({
        baseUrl: env.VENUS_URL,
        ...params,
    })
    const proxyRequest = new Request(url, {
        headers: authCookie
            ? {
                  Authorization: `Bearer ${authCookie.value}`,
              }
            : {},
    })

    try {
        return fetch(proxyRequest)
    } catch (_e) {
        return new Response("", { status: 500 })
    }
}
