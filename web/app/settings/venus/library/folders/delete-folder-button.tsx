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

import { FolderDto } from "@/apis/venus"
import { useAction } from "@/app/action/use-action"
import { DestructiveButton } from "@/app/components/button/destructive-button"
import { removeFolderAction } from "@/app/settings/venus/library/folders/folder-actions"
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

export const DeleteFolderButton = ({ folder }: { folder: FolderDto }) => {
    const removeFolder = useAction(removeFolderAction, venusErrorMapper)

    return (
        <DestructiveButton
            confirmation={{
                header: "Exclude folder?",
                content: (
                    <>
                        <p>
                            All {folder.track_count} track
                            {folder.track_count === 1 ? "" : "s"} imported from
                            this folder will be removed from the library.
                        </p>

                        <p>No files will be deleted from your storage.</p>
                    </>
                ),
                icon: "remove",
                button: "Exclude from library",
            }}
            variant="red"
            icon="remove"
            ongoing={removeFolder.ongoing}
            onClick={() => removeFolder.run(folder.id)}
        />
    )
}
