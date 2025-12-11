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
import { actionDataOf, actionErrorOf } from "@/app/action/action"
import { ActionOutcome, ActionResultWithData } from "@/app/action/action-types"

type RequestResult<TData, TError> = (
    | {
          data: TData
          error: undefined
      }
    | {
          data: undefined
          error: TError
      }
) & {
    response: Response
}

export async function actionFromFetch<TData, TError, TRawError>(
    result: Promise<RequestResult<TData, TRawError>>,
    errorMapper?: (
        e: TRawError,
    ) => TError | typeof ActionOutcome.unknownFailure,
): Promise<ActionResultWithData<TData, TError>> {
    const { data, error, response } = await result
    const statusAsString = response.status.toString()

    if (statusAsString.startsWith("5")) {
        return ActionOutcome.unknownFailure
    }
    if (response.status === 403) {
        return ActionOutcome.forbidden
    }
    if (response.status === 404) {
        return ActionOutcome.notFound
    }
    if (error) {
        if (errorMapper) {
            const mapping = errorMapper(error)
            if (mapping === ActionOutcome.unknownFailure) {
                return ActionOutcome.unknownFailure
            }

            return actionErrorOf(mapping)
        }

        return ActionOutcome.unknownFailure
    }
    if (!data) {
        return ActionOutcome.unknownFailure
    }

    return actionDataOf(data)
}
