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

import { NoSplitEntryDto } from "@/apis/venus"
import { useAction } from "@/app/action/use-action"
import { Button } from "@/app/components/button/button"
import { Input } from "@/app/components/input/input"
import {
    deleteNoSplitEntryAction,
    updateNoSplitEntryAction,
} from "@/app/settings/venus/tagging/no-split/no-split-actions"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { useState } from "react"

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

type NoSplitEntryProps = {
    entry: NoSplitEntryDto
}

export const NoSplitEntry = ({ entry }: NoSplitEntryProps) => {
    const [name, setName] = useState(entry.name)
    const [isEditing, setIsEditing] = useState(false)

    const updateEntry = useAction(updateNoSplitEntryAction, venusErrorMapper, {
        onSuccess: () => {
            setIsEditing(false)
        },
        onError: () => {
            setName(entry.name)
            setIsEditing(false)
        },
    })
    const deleteEntry = useAction(deleteNoSplitEntryAction, venusErrorMapper)

    return (
        <div className="flex items-center gap-1 border-gray-700 p-3 not-last-of-type:border-b-2">
            {!isEditing && (
                <>
                    <span className="grow px-3 py-2 text-sm font-medium inset-ring inset-ring-gray-500">
                        {entry.name}
                    </span>
                    <Button icon="edit" onClick={() => setIsEditing(true)} />
                    <Button
                        icon="remove"
                        variant="red"
                        ongoing={deleteEntry.ongoing}
                        onClick={() => deleteEntry.run(entry.id)}
                    />
                </>
            )}

            {isEditing && (
                <>
                    <Input
                        className="grow"
                        value={name}
                        disabled={updateEntry.ongoing}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Button
                        icon="check"
                        variant="accent"
                        ongoing={updateEntry.ongoing}
                        onClick={() => {
                            if (
                                entry.name.toLowerCase() === name.toLowerCase()
                            ) {
                                setIsEditing(false)
                                return
                            }

                            updateEntry.run(entry.id, name)
                        }}
                    />
                    <Button
                        icon="close"
                        onClick={() => {
                            setIsEditing(false)
                            setName(entry.name)
                        }}
                    />
                </>
            )}
        </div>
    )
}
