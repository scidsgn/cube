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
import "dotenv/config"
import { readFileSync } from "fs"
import { z } from "zod"

const envSchema = z.object({
    VENUS_URL: z.url(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_DB: z.string(),
    MEDIA_DRIVE: z.string(),
    JWT_PUBLIC_KEY_PATH: z.string(),
    JWT_PRIVATE_KEY_PATH: z.string(),
    JWT_ISSUER: z.string(),
})

export const env = envSchema.parse(process.env)

export const secrets = {
    jwtPublicKey: readFileSync(env.JWT_PUBLIC_KEY_PATH, "utf8"),
    jwtPrivateKey: readFileSync(env.JWT_PRIVATE_KEY_PATH, "utf8"),
}

export const databaseUrl = `postgresql://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@${env.POSTGRES_HOST}/${env.POSTGRES_DB}?schema=public`
