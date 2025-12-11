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
import { Button, ButtonProps } from "@/app/components/button/button"
import { IconType } from "@/app/components/icon/icon-type"
import { Popover } from "@/app/components/popover/popover"
import { ReactNode } from "react"

type DestructiveConfirmationPopoverDetails = {
    header: string
    content: ReactNode
    icon?: IconType
    button: string
}

type DestructiveButtonProps = Omit<ButtonProps, "content"> & {
    confirmation: DestructiveConfirmationPopoverDetails
}

export const DestructiveButton = ({
    confirmation,
    onClick,
    ...props
}: DestructiveButtonProps) => {
    const confirmContent = (
        <div className="flex w-sm max-w-screen flex-col gap-3 px-4 py-3">
            <header className="text-lg font-semibold text-red-400">
                {confirmation.header}
            </header>

            <div className="tracking-sm flex flex-col gap-3 text-sm font-medium">
                {confirmation.content}
            </div>

            <Button
                className="my-1 self-end"
                icon={confirmation.icon}
                variant="red"
                onClick={onClick}
            >
                {confirmation.button}
            </Button>
        </div>
    )

    return <Popover content={confirmContent} variant="red" {...props} />
}
