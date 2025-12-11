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
import { updateTrackFeaturesAction } from "@/app/settings/venus/tagging/tagging-actions"
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

type TrackFeaturesSectionProps = {
    settings: ScanSettingsDto
}

export const TrackFeaturesSection = ({
    settings,
}: TrackFeaturesSectionProps) => {
    const updateTrackFeatures = useAction(
        updateTrackFeaturesAction,
        venusErrorMapper,
    )

    return (
        <SettingsSection name="Track features extraction">
            <p className="font-medium">
                Artists credited as features or remixers in track titles, for
                example &#34;Killah feat. Gesaffelstein&#34;, can be added to
                the database under that role.
            </p>

            <Checkbox
                checked={settings.extract_track_features}
                ongoing={updateTrackFeatures.ongoing}
                onCheckedChange={(checked) =>
                    updateTrackFeatures.run(!!checked)
                }
            >
                Extract features and remixers from track metadata
            </Checkbox>
        </SettingsSection>
    )
}
