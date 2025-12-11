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
import { Popover } from "@/app/components/popover/popover"
import { DirectoryBrowser } from "@/app/directory-browser/directory-browser"
import { addFolderAction } from "@/app/settings/venus/library/folders/folder-actions"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"

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

export const AddFolderButton = () => {
    const addFolder = useAction(addFolderAction, venusErrorMapper)

    return (
        <Popover
            icon="add"
            content={
                <div className="w-screen max-w-120">
                    <DirectoryBrowser
                        onDirectorySelect={(path) => addFolder.run(path)}
                    />
                </div>
            }
            ongoing={addFolder.ongoing}
        >
            Add folder
        </Popover>
    )
}
