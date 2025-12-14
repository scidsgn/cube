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

"use client"

import {
    ActionErrorMapper,
    ActionOutcome,
    ActionResult,
} from "@/app/action/action-types"
import { openToast } from "@/app/components/toast/toasts-store"
import { useCallback, useMemo, useState } from "react"

type UseActionOptions = {
    onSuccess?: () => unknown
    onError?: () => unknown
}

export function useAction<TError, TArgs extends unknown[]>(
    action: (...args: TArgs) => Promise<ActionResult<TError>>,
    mapper: ActionErrorMapper<TError>,
    options?: UseActionOptions,
) {
    const [ongoing, setOngoing] = useState(false)

    const run = useCallback(
        async (...args: TArgs) => {
            setOngoing(true)
            const outcome = await action(...args)
            setOngoing(false)

            if (outcome === ActionOutcome.ok) {
                options?.onSuccess?.()
                return
            }

            options?.onError?.()

            switch (outcome) {
                case ActionOutcome.unknownFailure:
                    openToast({
                        type: "error",
                        title: "Action failed",
                        message: "Unknown error",
                    })
                    return
                case ActionOutcome.forbidden:
                    openToast({
                        type: "error",
                        title: "Action failed",
                        message: "Forbidden",
                    })
                    return
                case ActionOutcome.notFound:
                    openToast({
                        type: "error",
                        title: "Action failed",
                        message: "Not found",
                    })
                    return
            }

            const errorMessage = mapper(outcome.error)
            openToast({
                type: "error",
                title: "Action failed",
                message: errorMessage,
            })
        },
        [action, mapper, options],
    )

    return useMemo(() => ({ run, ongoing }), [run, ongoing])
}
