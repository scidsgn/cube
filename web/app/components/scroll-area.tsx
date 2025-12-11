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
import { cx } from "@/app/cva.config"
import {
    Corner,
    Root,
    Scrollbar,
    Thumb,
    Viewport,
} from "@radix-ui/react-scroll-area"
import { ReactNode } from "react"

type ScrollAreaProps = {
    className?: string
    viewportClassName?: string
    scrollbarsClassName?: string
    children?: ReactNode
}

export const ScrollArea = ({
    className,
    viewportClassName,
    scrollbarsClassName,
    children,
}: ScrollAreaProps) => {
    return (
        <Root className={cx("relative", className)}>
            <Viewport className={cx("size-full", viewportClassName)}>
                {children}
            </Viewport>
            <div
                className={cx(
                    "pointer-events-none absolute inset-0",
                    scrollbarsClassName,
                )}
            >
                <Scrollbar
                    className="pointer-events-auto relative flex h-3 flex-col before:absolute before:inset-1 before:bg-gray-900"
                    orientation="horizontal"
                >
                    <Thumb className="relative flex-1 before:absolute before:inset-0.5 before:bg-gray-300" />
                </Scrollbar>
                <Scrollbar
                    className="pointer-events-auto relative flex w-3 before:absolute before:inset-1 before:bg-gray-900"
                    orientation="vertical"
                >
                    <Thumb className="relative flex-1 before:absolute before:inset-0.5 before:bg-gray-300" />
                </Scrollbar>
                <Corner className="pointer-events-auto" />
            </div>
        </Root>
    )
}
