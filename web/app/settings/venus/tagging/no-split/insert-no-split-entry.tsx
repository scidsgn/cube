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

import { useAction } from "@/app/action/use-action"
import { Button } from "@/app/components/button/button"
import { Input } from "@/app/components/input/input"
import { insertNoSplitEntryAction } from "@/app/settings/venus/tagging/no-split/no-split-actions"
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

export const InsertNoSplitEntry = () => {
    const [name, setName] = useState("")

    const insertEntry = useAction(insertNoSplitEntryAction, venusErrorMapper, {
        onSuccess: () => setName(""),
    })

    return (
        <div className="flex gap-1">
            <Input
                className="grow"
                placeholder="e.g. Earth, Wind & Fire"
                value={name}
                disabled={insertEntry.ongoing}
                onChange={(e) => setName(e.target.value)}
            />
            <Button
                icon="add"
                variant="accent"
                ongoing={insertEntry.ongoing}
                onClick={() => insertEntry.run(name)}
            />
        </div>
    )
}
