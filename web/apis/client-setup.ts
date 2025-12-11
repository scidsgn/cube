import { client as venusClient } from "@/apis/venus/client.gen"
import { ResolvedRequestOptions } from "@/apis/venus/client/types.gen"
import { getCookies } from "@/app/auth/cookies"
import { ReadonlyRequestCookiesAdapter } from "@/app/auth/cookies/readonly-request-cookies-adapter"
import { env } from "@/app/env"
import { cookies } from "next/headers"

async function insertAuthToken(options: ResolvedRequestOptions) {
    if (!options.headers) {
        return
    }

    const cookieStore = new ReadonlyRequestCookiesAdapter(await cookies())

    const { authCookie } = getCookies(cookieStore)
    if (authCookie) {
        const headers = options.headers as Headers

        options.headers = {
            ...Object.fromEntries(headers.entries()),
            Authorization: `Bearer ${authCookie.value}`,
        }
    }
}

export function setupClients() {
    venusClient.setConfig({
        baseUrl: env.VENUS_URL,
    })

    venusClient.interceptors.request.use(insertAuthToken)
}
