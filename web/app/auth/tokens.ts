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
import { db } from "@/apis/db"
import { RefreshToken } from "@/apis/prisma/client"
import { getUserById } from "@/app/auth/db"
import { env, secrets } from "@/app/env"
import { JwtPayload, sign, verify } from "jsonwebtoken"
import ms, { StringValue } from "ms"

export async function obtainRefreshToken(
    userId: number,
): Promise<RefreshToken> {
    return db.refreshToken.create({
        data: {
            userId,
            externalId: crypto.randomUUID(),
            expires: new Date(Date.now() + ms("7days")),
        },
    })
}

export async function obtainAuthJwt(
    userId: number,
    expiry: StringValue,
): Promise<string | null> {
    const user = await getUserById(userId)
    if (!user) {
        return null
    }

    return sign(
        {
            role: user.role,
        },
        secrets.jwtPrivateKey,
        {
            algorithm: "RS512",
            expiresIn: expiry,
            issuer: env.JWT_ISSUER,
            subject: user.externalId,
        },
    )
}

export function decodeAuthJwt(token: string): JwtPayload | null {
    try {
        const payload = verify(token, secrets.jwtPublicKey, {
            algorithms: ["RS512"],
            issuer: env.JWT_ISSUER,
        })
        if (typeof payload === "string") {
            return null
        }

        return payload
    } catch (_) {
        return null
    }
}
