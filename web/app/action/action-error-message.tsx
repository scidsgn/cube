/*
 * CUBE
 * Copyright (C) 2025-2026  scidsgn
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

import { ActionErrorMapper, ActionOutcome } from "@/app/action/action-types"
import { DefaultActionErrorComponents } from "@/app/action/default-action-error-components"
import { ReactNode } from "react"

export type ActionErrorComponents = Record<
    Exclude<ActionOutcome, typeof ActionOutcome.ok>,
    ReactNode
> & {
    mappedError: (error: string) => ReactNode
}

type ActionErrorMessageProps<TError> = {
    result: Exclude<ActionOutcome, typeof ActionOutcome.ok> | { error: TError }
    mapper?: ActionErrorMapper<TError>
    components?: ActionErrorComponents
}

export const ActionErrorMessage = <TError,>({
    result,
    mapper,
    components = DefaultActionErrorComponents,
}: ActionErrorMessageProps<TError>) => {
    if (typeof result === "string") {
        switch (result) {
            case ActionOutcome.forbidden:
                return components[ActionOutcome.forbidden]
            case ActionOutcome.unknownFailure:
                return components[ActionOutcome.unknownFailure]
            case ActionOutcome.notFound:
                return components[ActionOutcome.notFound]
            case ActionOutcome.connectionFailed:
                return components[ActionOutcome.connectionFailed]
        }
    }

    if (!mapper) {
        return components[ActionOutcome.unknownFailure]
    }

    return components.mappedError(mapper(result.error))
}
