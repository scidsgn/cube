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
import { InputHTMLAttributes } from "react"

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean
}

export const Input = ({ className, error, disabled, ...props }: InputProps) => {
    return (
        <input
            className={cx(
                "inset-ring-accent-500 bg-black px-3 py-2 text-sm font-medium text-gray-50 outline-none placeholder:text-gray-600 focus-visible:inset-ring",
                disabled && "bg-black/70 text-gray-50/60",
                error && "inset-ring inset-ring-red-500",
                className,
            )}
            disabled={disabled}
            {...props}
        />
    )
}
