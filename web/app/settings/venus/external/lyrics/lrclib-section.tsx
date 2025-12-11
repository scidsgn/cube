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

import { LyricsSettingsDto } from "@/apis/venus"
import { useAction } from "@/app/action/use-action"
import { Button } from "@/app/components/button/button"
import { Checkbox } from "@/app/components/checkbox"
import { Input } from "@/app/components/input/input"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { updateLyricsSettingsAction } from "@/app/settings/venus/external/lyrics/lyrics-actions"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

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

type LyricsSectionProps = {
    settings: LyricsSettingsDto
}

const apiUrlSchema = z.object({
    apiUrl: z.url(),
})

export const LrclibSection = ({ settings }: LyricsSectionProps) => {
    const { control, formState, handleSubmit, reset } = useForm<
        z.infer<typeof apiUrlSchema>
    >({
        mode: "all",
        defaultValues: {
            apiUrl: settings.lrclib_api_url,
        },
        resolver: zodResolver(apiUrlSchema),
    })

    const updateLyricsSettings = useAction(
        updateLyricsSettingsAction,
        venusErrorMapper,
    )

    useEffect(() => {
        reset({
            apiUrl: settings.lrclib_api_url,
        })
    }, [settings.lrclib_api_url, reset])

    const onSubmit = async (data: z.infer<typeof apiUrlSchema>) => {
        await updateLyricsSettings.run({ lrclib_api_url: data.apiUrl })
    }

    return (
        <SettingsSection name="Lyrics fetching">
            <p className="font-medium">
                CUBE can automatically check{" "}
                <Link
                    className="text-accent-500 hover:underline"
                    href="https://lrclib.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    LRCLIB
                </Link>{" "}
                for lyrics. Both plain and synced lyrics are supported.
            </p>

            <Checkbox
                checked={settings.fetch_lyrics}
                ongoing={updateLyricsSettings.ongoing}
                onCheckedChange={(checked) => {
                    if (checked === true) {
                        updateLyricsSettings.run({ fetch_lyrics: true })
                    } else {
                        updateLyricsSettings.run({ fetch_lyrics: false })
                    }
                }}
            >
                Fetch lyrics from LRCLIB
            </Checkbox>

            <p className="font-medium">
                CUBE can fetch from any server exposing a LRCLIB-compatible API.
            </p>

            <form
                className="flex min-w-0 items-center gap-1"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    render={({ field }) => (
                        <Input
                            className="grow"
                            placeholder="LRCLIB API URL"
                            error={!!formState.errors.apiUrl}
                            {...field}
                        />
                    )}
                    name="apiUrl"
                    control={control}
                />

                <Button
                    type="submit"
                    variant="accent"
                    disabled={!formState.isValid}
                    ongoing={updateLyricsSettings.ongoing}
                >
                    Set
                </Button>
            </form>
        </SettingsSection>
    )
}
