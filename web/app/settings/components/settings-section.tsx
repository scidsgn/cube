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
import { ReactNode } from "react"

type SettingsSectionProps = {
    name: string
    children?: ReactNode
}

export const SettingsSection = ({ name, children }: SettingsSectionProps) => {
    return (
        <section className="flex max-w-180 flex-col gap-4">
            <h2 className="-mb-2 pb-2 text-lg font-semibold">{name}</h2>
            {children}
        </section>
    )
}
