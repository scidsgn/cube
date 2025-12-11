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

import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { IconType } from "@/app/components/icon/icon-type"
import { LoadingIcon } from "@/app/components/icon/loading-icon"
import { cva, cx } from "@/app/cva.config"
import { VariantProps } from "cva"
import Link from "next/link"
import { ButtonHTMLAttributes, ComponentProps } from "react"

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

export const buttonVariants = cva({
    base: "disabled:pointer-not-allowed flex items-center font-medium text-nowrap transition-colors duration-50 disabled:bg-transparent! disabled:text-gray-500/80!",
    variants: {
        variant: {
            dark: "bg-gray-900 text-gray-50 hover:bg-gray-800 active:bg-gray-700 disabled:inset-ring-2 disabled:inset-ring-gray-500/30",
            red: "bg-[color-mix(in_oklab,var(--color-gray-900)_50%,var(--color-red-800)_50%)] font-semibold text-red-200 hover:bg-[color-mix(in_oklab,var(--color-gray-800)_50%,var(--color-red-700)_50%)] active:bg-[color-mix(in_oklab,var(--color-gray-700)_50%,var(--color-red-600)_50%)] disabled:inset-ring-2 disabled:inset-ring-gray-500/30",
            transparent:
                "bg-transparent text-gray-50 hover:bg-gray-50/8 active:bg-gray-50/15",
            accent: "bg-accent-700 text-accent-50 hover:bg-accent-600 active:bg-accent-500 font-semibold disabled:inset-ring-2 disabled:inset-ring-gray-500/30",
        },
        size: {
            md: "h-9 gap-1 px-2 text-sm",
            lg: "h-11 gap-0.5 px-2.5 text-base",
        },
    },
    defaultVariants: {
        variant: "dark",
        size: "md",
    },
})

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants> & {
        icon?: IconType
        fill?: boolean
        ongoing?: boolean
    }

type LinkButtonProps = ComponentProps<typeof Link> &
    VariantProps<typeof buttonVariants> & {
        icon?: IconType
        fill?: boolean
    }

export const Button = ({
    children,
    className,
    variant,
    size,
    icon,
    fill,
    ongoing,
    disabled,
    ...props
}: ButtonProps) => {
    return (
        <button
            type="button"
            className={cx(buttonVariants({ variant, size }), className)}
            disabled={ongoing || disabled}
            {...props}
        >
            {icon &&
                (ongoing ? (
                    <LoadingIcon size={size === "lg" ? 24 : 20} />
                ) : (
                    <IconSymbol
                        icon={icon}
                        size={size === "lg" ? 24 : 20}
                        fill={
                            fill ?? (variant === "accent" || variant === "red")
                        }
                    />
                ))}
            {children && (
                <span className={size === "lg" ? "px-1" : "px-0.5"}>
                    {children}
                </span>
            )}
        </button>
    )
}

export const LinkButton = ({
    children,
    className,
    variant,
    size,
    icon,
    fill,
    ...props
}: LinkButtonProps) => {
    return (
        <Link
            className={cx(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {icon && (
                <IconSymbol
                    icon={icon}
                    size={size === "lg" ? 24 : 20}
                    fill={fill ?? (variant === "accent" || variant === "red")}
                />
            )}
            {children && (
                <span className={size === "lg" ? "px-1" : "px-0.5"}>
                    {children}
                </span>
            )}
        </Link>
    )
}
