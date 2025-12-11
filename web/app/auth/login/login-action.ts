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

import { actionErrorOf } from "@/app/action/action"
import { ActionOutcome } from "@/app/action/action-types"
import { login } from "@/app/auth/auth"
import { ReadonlyRequestCookiesAdapter } from "@/app/auth/cookies/readonly-request-cookies-adapter"
import { UserActionError } from "@/app/auth/user-action-errors"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

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

export async function loginAction(
    userName: string,
    password: string,
    redirectPath: string | null,
) {
    try {
        const cookieStore = await cookies()

        const result = await login(
            { userName, password },
            new ReadonlyRequestCookiesAdapter(cookieStore),
        )

        if (result === false) {
            return actionErrorOf(UserActionError.invalidCredentials)
        }
    } catch (error) {
        return ActionOutcome.unknownFailure
    }

    if (redirectPath) {
        redirect(redirectPath)
    } else {
        redirect("/")
    }
}
