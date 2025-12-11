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
import { ScrollArea } from "@/app/components/scroll-area"
import { cx } from "@/app/cva.config"
import { HTMLAttributes } from "react"

export const PageLayout = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <div
            className={cx(
                "absolute inset-0 top-0 flex items-stretch pt-21",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export const PageSidebar = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <ScrollArea className="w-73 shrink-0">
            <aside className={cx("pr-3 pb-6 pl-6", className)} {...props}>
                {children}
            </aside>
        </ScrollArea>
    )
}
export const PageContent = ({
    children,
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {
    return (
        <ScrollArea
            className="max-w-full min-w-0 grow"
            viewportClassName="[&>div]:block!"
        >
            <div className={cx("pr-6 pb-6 pl-3", className)} {...props}>
                {children}
            </div>
        </ScrollArea>
    )
}
