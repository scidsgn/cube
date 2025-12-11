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

type LoadingIconProps = {
    className?: string
    size?: number
}

export const LoadingIcon = ({ className, size = 24 }: LoadingIconProps) => {
    return (
        <div className={className}>
            <div className="relative" style={{ width: size, height: size }}>
                <div className="absolute inset-0">
                    <div className="absolute size-0.5 animate-[loading-icon-move_0.5s_infinite] bg-current" />
                </div>
                <div className="absolute inset-0 rotate-90">
                    <div className="absolute size-0.5 animate-[loading-icon-move_0.5s_infinite] bg-current" />
                </div>
                <div className="absolute inset-0 rotate-180">
                    <div className="absolute size-0.5 animate-[loading-icon-move_0.5s_infinite] bg-current" />
                </div>
                <div className="absolute inset-0 rotate-270">
                    <div className="absolute size-0.5 animate-[loading-icon-move_0.5s_infinite] bg-current" />
                </div>
            </div>
        </div>
    )
}
