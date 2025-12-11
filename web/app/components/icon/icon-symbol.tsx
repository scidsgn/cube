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
import { IconType } from "@/app/components/icon/icon-type"
import { cx } from "@/app/cva.config"

type IconProps = {
    icon: IconType
    className?: string
    fill?: boolean
    size?: number
    weight?: number
}

export const IconSymbol = ({
    icon,
    className,
    fill,
    size = 24,
    weight = 300,
}: IconProps) => {
    return (
        <span
            className={cx("material-symbols-sharp", className)}
            style={{
                fontSize: size,
                fontVariationSettings: `'opsz' ${size}, 'wght' ${weight}, 'FILL' ${fill ? 1 : 0}`,
            }}
        >
            {icon}
        </span>
    )
}
