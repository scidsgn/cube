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

import { Button } from "@/app/components/button/button"
import { useToastStore } from "@/app/components/toast/toasts-store"
import { ScrollArea } from "@/app/components/scroll-area"
import { cva } from "@/app/cva.config"
import { IconSymbol } from "@/app/components/icon/icon-symbol"

const toastHeaderVariants = cva({
    base: "flex min-w-0 items-center gap-2 font-medium",
    variants: {
        variant: {
            info: "text-blue-300",
            warning: "text-orange-300",
            error: "text-red-300",
        },
    },
})

export const Toasts = () => {
    const toasts = useToastStore((state) => state.toasts)
    const closeToast = useToastStore((state) => state.closeToast)

    if (toasts.length === 0) {
        return null
    }

    return (
        <div className="fixed top-21 right-6">
            <ScrollArea
                className="-mx-[2px] border-2 border-gray-950 shadow-lg shadow-gray-950"
                viewportClassName="max-h-[calc(100vh-27*var(--spacing))] w-[calc(100vw-12*var(--spacing))] max-w-96 bg-red-300"
            >
                <div className="flex flex-col bg-gray-900">
                    {toasts.map((toast) => (
                        <div
                            key={toast.id}
                            className="flex min-w-0 border-gray-700 not-last-of-type:border-b-2"
                        >
                            <div className="flex min-w-0 grow flex-col gap-1 px-3 py-2">
                                <div
                                    className={toastHeaderVariants({
                                        variant: toast.type,
                                    })}
                                >
                                    <IconSymbol
                                        icon={toast.type}
                                        size={20}
                                        weight={500}
                                    />
                                    <p className="grow truncate">
                                        {toast.title}
                                    </p>
                                </div>
                                <p className="tracking-sm text-sm font-medium text-gray-300">
                                    {toast.message}
                                </p>
                            </div>
                            <Button
                                icon="close"
                                onClick={() => closeToast(toast.id)}
                            />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
