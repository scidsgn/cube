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

import { MusicbrainzSettingsDto } from "@/apis/venus"
import { useAction } from "@/app/action/use-action"
import { Button } from "@/app/components/button/button"
import { Checkbox } from "@/app/components/checkbox"
import { Input } from "@/app/components/input/input"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { updateMusicbrainzSettingsAction } from "@/app/settings/venus/external/musicbrainz/musicbrainz-actions"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"
import { zodResolver } from "@hookform/resolvers/zod"
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

type MusicbrainzSectionProps = {
    settings: MusicbrainzSettingsDto
}

const apiUrlSchema = z.object({
    apiUrl: z.url(),
})

export const MusicbrainzSection = ({ settings }: MusicbrainzSectionProps) => {
    const { control, formState, handleSubmit, reset } = useForm<
        z.infer<typeof apiUrlSchema>
    >({
        mode: "all",
        defaultValues: {
            apiUrl: settings.mb_api_hostname,
        },
        resolver: zodResolver(apiUrlSchema),
    })

    const updateMusicbrainzSettings = useAction(
        updateMusicbrainzSettingsAction,
        venusErrorMapper,
    )

    useEffect(() => {
        reset({
            apiUrl: settings.mb_api_hostname,
        })
    }, [settings.mb_api_hostname, reset])

    const onSubmit = async (data: z.infer<typeof apiUrlSchema>) => {
        await updateMusicbrainzSettings.run({ mb_api_hostname: data.apiUrl })
    }

    return (
        <SettingsSection name="Musicbrainz data">
            <p className="font-medium">
                CUBE can use data added to music files with Musicbrainz Picard
                to fetch additional details about songs and releases (liner
                notes, publishing information, etc.)
            </p>

            <Checkbox
                checked={settings.fetch_data}
                ongoing={updateMusicbrainzSettings.ongoing}
                onCheckedChange={(checked) => {
                    if (checked === true) {
                        updateMusicbrainzSettings.run({ fetch_data: true })
                    } else {
                        updateMusicbrainzSettings.run({ fetch_data: false })
                    }
                }}
            >
                Fetch additional data from Musicbrainz
            </Checkbox>

            <p className="font-medium">
                Any Musicbrainz-compatible server can be used.
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
                    ongoing={updateMusicbrainzSettings.ongoing}
                >
                    Set
                </Button>
            </form>
        </SettingsSection>
    )
}
