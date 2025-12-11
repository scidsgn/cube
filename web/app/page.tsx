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
import { ensureLoggedIn } from "@/app/auth/action-guards"
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { ScrollArea } from "@/app/components/scroll-area"
import Link from "next/link"

const HomePage = async () => {
    const user = await ensureLoggedIn()
    if (!user) {
        return null
    }

    return (
        <div className="absolute inset-0 top-21 grid grid-cols-1 grid-rows-1">
            <ScrollArea className="" viewportClassName="[&>div]:block!">
                <div className="flex min-h-[calc(100vh-21*var(--spacing))] flex-col items-center justify-center p-6">
                    <div className="mb-16">
                        <p className="text-3xl font-medium">
                            Hello, @{user.userName}
                        </p>
                        <p className="text-accent-500 text-3xl font-semibold">
                            Welcome to CUBE
                        </p>

                        <div className="mt-6 flex gap-4">
                            <Link
                                className="flex w-28 flex-col items-center gap-1 bg-gray-900 px-4 py-3 font-medium text-gray-50 hover:bg-gray-800 active:bg-gray-700"
                                href="/venus/artists"
                            >
                                <IconSymbol
                                    className="text-gray-200"
                                    icon="music_note"
                                    size={48}
                                />
                                Music
                            </Link>
                            <Link
                                className="flex w-28 flex-col items-center gap-1 bg-gray-900 px-4 py-3 font-medium text-gray-50 hover:bg-gray-800 active:bg-gray-700"
                                href="/venus/artists"
                            >
                                <IconSymbol
                                    className="text-gray-200"
                                    icon="settings"
                                    size={48}
                                />
                                Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

export default HomePage
