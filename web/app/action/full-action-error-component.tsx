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

import { ActionErrorComponents } from "@/app/action/action-error-message"
import { ActionOutcome } from "@/app/action/action-types"
import { DefaultActionErrorComponents } from "@/app/action/default-action-error-components"
import { ReactNode } from "react"

const FullPageWrapper = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="absolute inset-0 top-21 grid place-items-center">
            {children}
        </div>
    )
}

export const FullPageActionErrorComponents: ActionErrorComponents = {
    [ActionOutcome.forbidden]: (
        <FullPageWrapper>
            {DefaultActionErrorComponents[ActionOutcome.forbidden]}
        </FullPageWrapper>
    ),
    [ActionOutcome.notFound]: (
        <FullPageWrapper>
            {DefaultActionErrorComponents[ActionOutcome.notFound]}
        </FullPageWrapper>
    ),
    [ActionOutcome.unknownFailure]: (
        <FullPageWrapper>
            {DefaultActionErrorComponents[ActionOutcome.unknownFailure]}
        </FullPageWrapper>
    ),
    [ActionOutcome.connectionFailed]: (
        <FullPageWrapper>
            {DefaultActionErrorComponents[ActionOutcome.connectionFailed]}
        </FullPageWrapper>
    ),
    mappedError: (error) => (
        <FullPageWrapper>
            {DefaultActionErrorComponents.mappedError(error)}
        </FullPageWrapper>
    ),
}
