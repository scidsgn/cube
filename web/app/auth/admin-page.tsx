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
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { ActionOutcome } from "@/app/action/action-types"
import { ensureAdmin } from "@/app/auth/action-guards"
import { ReactNode } from "react"

type AdminPageOptions = {
    errorComponent?: ReactNode
}

export const adminPage = <TArgs extends unknown[]>(
    page: (...args: TArgs) => ReactNode | Promise<ReactNode>,
    options?: AdminPageOptions,
) => {
    // eslint-disable-next-line react/display-name
    return async (...args: TArgs) => {
        const user = await ensureAdmin()
        if (!user) {
            return (
                options?.errorComponent ?? (
                    <ActionErrorMessage result={ActionOutcome.forbidden} />
                )
            )
        }

        return page(...args)
    }
}
