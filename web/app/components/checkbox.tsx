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
import { LoadingIcon } from "@/app/components/icon/loading-icon"
import { cx } from "@/app/cva.config"
import { Indicator, Root } from "@radix-ui/react-checkbox"
import { ComponentProps } from "react"

type CheckboxProps = ComponentProps<typeof Root> & { ongoing?: boolean }

export const Checkbox = ({
    className,
    children,
    ongoing,
    disabled,
    ...props
}: CheckboxProps) => {
    return (
        <label className={cx("flex gap-2", className)}>
            <Root
                className={cx(
                    "data-[state=checked]:bg-accent-700 data-[state=checked]:hover:bg-accent-600 data-[state=checked]:active:bg-accent-500 size-6 shrink-0 bg-gray-800 hover:bg-gray-700 active:bg-gray-600",
                    "disabled:bg-transparent! disabled:text-gray-500 disabled:inset-ring-2 disabled:inset-ring-gray-500/30",
                )}
                disabled={disabled || ongoing}
                {...props}
            >
                {!ongoing && (
                    <Indicator className="grid place-items-center">
                        <IconSymbol icon="check" weight={700} size={20} />
                    </Indicator>
                )}
                {ongoing && (
                    <div className="grid size-full place-items-center">
                        <LoadingIcon />
                    </div>
                )}
            </Root>
            <span className="py-0.5 text-sm font-medium">{children}</span>
        </label>
    )
}
