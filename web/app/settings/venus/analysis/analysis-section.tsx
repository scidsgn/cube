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

import { MusicalAnalysisSettingsDto } from "@/apis/venus"
import { useAction } from "@/app/action/use-action"
import { Callout } from "@/app/components/callout/callout"
import { Checkbox } from "@/app/components/checkbox"
import { SettingsSection } from "@/app/settings/components/settings-section"
import { updateMusicalAnalysisLevelAction } from "@/app/settings/venus/analysis/analysis-actions"
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

type AnalysisSectionProps = {
    settings: MusicalAnalysisSettingsDto
}

export const AnalysisSection = ({ settings }: AnalysisSectionProps) => {
    const updateMusicalAnalysisLevel = useAction(
        updateMusicalAnalysisLevelAction,
        venusErrorMapper,
    )

    return (
        <SettingsSection name="Musical analysis">
            <p className="font-medium">
                CUBE can use the librosa library to estimate musical information
                about each track (tempo in BPM, key signature).
            </p>

            <Callout header="Rescan to apply changes">
                <p>
                    Your library needs to be rescanned for analysis to take
                    effect.
                </p>

                <p>
                    If you choose to disable the analysis after having scanned
                    your tracks, the data already present in your library will
                    not be deleted, unless the music files have changed since.
                </p>
            </Callout>

            <Checkbox
                checked={settings.level !== "none"}
                ongoing={updateMusicalAnalysisLevel.ongoing}
                onCheckedChange={(checked) => {
                    if (checked === true) {
                        updateMusicalAnalysisLevel.run("basic")
                    } else {
                        updateMusicalAnalysisLevel.run("none")
                    }
                }}
            >
                Enable musical feature estimation
            </Checkbox>
        </SettingsSection>
    )
}
