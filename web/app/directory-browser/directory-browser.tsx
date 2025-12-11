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
import { actionFailed } from "@/app/action/action"
import { Button } from "@/app/components/button/button"
import { fetchSubdirectories } from "@/app/directory-browser/fetch-subdirectories"
import { useState } from "react"
import useSWR from "swr"

type DirectoryBrowserProps = {
    canSelectRoot?: boolean
    onDirectorySelect: (path: string) => void
}

export const DirectoryBrowser = ({
    canSelectRoot = false,
    onDirectorySelect,
}: DirectoryBrowserProps) => {
    const [currentPath, setCurrentPath] = useState<string[]>([])

    const { data } = useSWR(
        { type: "dirs", path: currentPath.join("/") },
        (key) => fetchSubdirectories(key.path),
    )

    const folders = (data && !actionFailed(data) && data.data) || []

    return (
        <div className="flex flex-col gap-1 p-1">
            <div className="flex min-w-0 items-center gap-2">
                <Button
                    icon="arrow_upward"
                    disabled={currentPath.length === 0}
                    onClick={() => setCurrentPath((p) => p.slice(0, -1))}
                />
                <span className="grow truncate font-mono text-sm">
                    /{currentPath.join("/")}
                </span>

                <Button
                    className="max-w-50 [&>span]:truncate"
                    variant="accent"
                    disabled={!canSelectRoot && currentPath.length === 0}
                    onClick={() => onDirectorySelect(currentPath.join("/"))}
                >
                    Select{" "}
                    {currentPath.length ? currentPath.slice(-1)[0] : "root"}
                </Button>
            </div>
            {folders.length > 0 && (
                <div className="flex flex-col gap-0.5">
                    {folders.map((dir) => (
                        <Button
                            key={dir}
                            icon="folder"
                            onClick={() => setCurrentPath((p) => [...p, dir])}
                        >
                            {dir}
                        </Button>
                    ))}
                </div>
            )}
            {folders.length === 0 && (
                <div className="p-4 text-center text-sm font-medium text-gray-400">
                    No directiories
                </div>
            )}
        </div>
    )
}
