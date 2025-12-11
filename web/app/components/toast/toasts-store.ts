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

import { useStore } from "zustand/react"
import { createStore } from "zustand/vanilla"

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

export type Toast = {
    id: string
    title: string
    message: string
}

type ToastStoreState = {
    toasts: Toast[]
    addToast: (toast: Toast) => void
    closeToast: (id: string) => void
}

const toastStore = createStore<ToastStoreState>((set) => ({
    toasts: [],

    addToast: (toast) =>
        set((state) => ({
            toasts: [...state.toasts, toast],
        })),
    closeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}))

export function useToastStore<T>(selector: (state: ToastStoreState) => T) {
    return useStore(toastStore, selector)
}

export function openToast(toast: Pick<Toast, "title" | "message">) {
    toastStore.getState().addToast({
        id: window.crypto.randomUUID(),
        ...toast,
    })
}
