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
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { cva } from "@/app/cva.config"
import { VariantProps } from "cva"
import { ReactNode } from "react"

const calloutVariants = cva({
    base: "flex flex-col gap-3 border-l-2 pt-3 pr-4 pb-4 pl-[calc(--spacing(4)-2px)]",
    variants: {
        variant: {
            info: "border-blue-400 bg-blue-600/10 text-blue-300",
            warning: "border-orange-400 bg-orange-600/10 text-orange-300",
            error: "border-red-400 bg-red-600/10 text-red-300",
        },
    },
})

type CalloutProps = VariantProps<typeof calloutVariants> & {
    header: string
    children?: ReactNode
}

export const Callout = ({
    variant = "info",
    header,
    children,
}: CalloutProps) => {
    return (
        <div className={calloutVariants({ variant })}>
            <header className="flex items-center gap-2">
                {variant && (
                    <IconSymbol icon={variant} size={20} weight={500} />
                )}
                <span className="font-medium">{header}</span>
            </header>
            <div className="tracking-sm flex flex-col gap-2 text-sm font-medium text-gray-50">
                {children}
            </div>
        </div>
    )
}
