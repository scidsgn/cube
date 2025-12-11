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
    ActionData,
    ActionError,
    ActionOutcome,
    ActionResult,
} from "@/app/action/action-types"

export function actionDataOf<TData>(data: TData): ActionData<TData> {
    return { data }
}

export function actionErrorOf<TError>(error: TError): ActionError<TError> {
    return { error }
}

export function actionFromResponse<TError>(
    response: Response,
    error?: TError | undefined | null,
): ActionResult<TError> {
    const status = response.status.toString()

    if (status.startsWith("5")) {
        return ActionOutcome.unknownFailure
    }
    if (error) {
        return actionErrorOf(error)
    }
    if (!status.startsWith("2")) {
        return ActionOutcome.unknownFailure
    }

    return ActionOutcome.ok
}

export function actionFailed<TError, T>(
    result:
        | T
        | Exclude<ActionOutcome, typeof ActionOutcome.ok>
        | ActionError<TError>,
): result is
    | Exclude<ActionOutcome, typeof ActionOutcome.ok>
    | ActionError<TError> {
    if (!result) {
        return true
    }
    if (!(typeof result === "object")) {
        return result !== ActionOutcome.ok
    }

    return "error" in result
}
