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

import { ScanSettingsDto } from "@/apis/venus"
import { useAction } from "@/app/action/use-action"
import { Checkbox } from "@/app/components/checkbox"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { updateArtistSplittingAction } from "@/app/settings/venus/tagging/tagging-actions"
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

type ArtistSplittingSectionProps = {
    settings: ScanSettingsDto
}

export const ArtistSplittingSection = ({
    settings,
}: ArtistSplittingSectionProps) => {
    const updateArtistSplitting = useAction(
        updateArtistSplittingAction,
        venusErrorMapper,
    )

    return (
        <SettingsSection name="Artist name handling">
            <p className="font-medium">
                Track metadata of songs made by multiple artists commonly
                contains their names both present in the artist tag, for example
                &#34;Lady Gaga & Bruno Mars&#34;. CUBE can parse this common
                notation to produce separate credits and pages for each artist.
            </p>

            <Checkbox
                checked={settings.split_artists}
                ongoing={updateArtistSplitting.ongoing}
                onCheckedChange={(checked) =>
                    updateArtistSplitting.run(!!checked)
                }
            >
                Split artist tags based on common separators (,&)
            </Checkbox>
        </SettingsSection>
    )
}
