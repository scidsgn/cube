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
import { venusGetFolders } from "@/apis/venus"
import { actionFailed } from "@/app/action/action"
import { ActionErrorMessage } from "@/app/action/action-error-message"
import { actionFromFetch } from "@/app/action/fetch-action"
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { AddFolderButton } from "@/app/settings/venus/library/folders/add-folder-button"
import { DeleteFolderButton } from "@/app/settings/venus/library/folders/delete-folder-button"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { VenusFetchTags } from "@/app/venus/venus-fetch-tags"
import { Fragment } from "react"

export const FoldersSection = async () => {
    const result = await actionFromFetch(
        venusGetFolders({
            next: {
                tags: [VenusFetchTags.libraryFolders],
            },
        }),
        (error) => error.code,
    )
    if (actionFailed(result)) {
        return <ActionErrorMessage result={result} mapper={venusErrorMapper} />
    }

    const folders = result.data.folders

    return (
        <SettingsSection name="Folders">
            <div className="flex flex-col gap-0.5">
                {folders.map((folder) => (
                    <div
                        key={folder.id}
                        className="flex items-center gap-3 bg-gray-900 px-3 py-2"
                    >
                        <IconSymbol
                            className={folder.invalid_reason && "text-gray-400"}
                            size={48}
                            fill
                            icon={
                                folder.invalid_reason ? "folder_off" : "folder"
                            }
                        />
                        <div className="flex grow flex-col">
                            <span className="inline-flex gap-1 font-medium">
                                {folder.path
                                    .split("/")
                                    .map((segment, i, segments) => (
                                        <Fragment key={i}>
                                            <span>{segment}</span>
                                            {i < segments.length - 1 && (
                                                <span className="text-gray-300">
                                                    /
                                                </span>
                                            )}
                                        </Fragment>
                                    ))}
                            </span>
                            {folder.invalid_reason ? (
                                <span className="tracking-sm text-sm font-medium text-red-300">
                                    {folder.invalid_reason}
                                </span>
                            ) : (
                                <span className="tracking-sm text-sm font-medium text-gray-300">
                                    {folder.track_count} song
                                    {folder.track_count === 1 ? "" : "s"}
                                </span>
                            )}
                        </div>

                        <DeleteFolderButton folder={folder} />
                    </div>
                ))}

                <div className="flex justify-end">
                    <AddFolderButton />
                </div>
            </div>
        </SettingsSection>
    )
}
