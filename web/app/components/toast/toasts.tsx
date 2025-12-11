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

export const Toasts = () => {
    const toasts = useToastStore((state) => state.toasts)
    const closeToast = useToastStore((state) => state.closeToast)

    if (toasts.length === 0) {
        return null
    }

    return (
        <div className="fixed top-21 right-6 flex w-96 flex-col bg-gray-900">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="flex min-w-0 border-gray-700 not-last-of-type:border-b-2"
                >
                    <div className="min-w-0 grow px-3 py-2">
                        <p className="font-medium">{toast.title}</p>
                        <p className="tracking-sm text-sm font-medium text-gray-300">
                            {toast.message}
                        </p>
                    </div>
                    <Button icon="close" onClick={() => closeToast(toast.id)} />
                </div>
            ))}
        </div>
    )
}
