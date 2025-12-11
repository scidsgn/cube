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
import { adminPage } from "@/app/auth/admin-page"
import { Callout } from "@/app/components/callout/callout"
import { LrclibSectionContainer } from "@/app/settings/venus/external/lyrics/lrclib-section-container"
import { MusicbrainzSectionContainer } from "@/app/settings/venus/external/musicbrainz/musicbrainz-section-container"

const VenusLyricsSettingsPage = adminPage(() => {
    return (
        <>
            <div className="max-w-180">
                <Callout
                    variant="warning"
                    header="These integrations require online connectivity by default"
                >
                    <p>
                        If you wish to control the external services CUBE
                        connects to, keep these integrations disabled.
                    </p>

                    <p>
                        You can also provide alternative endpoints for CUBE to
                        use if they are compatible with the original API of each
                        service.
                    </p>
                </Callout>
            </div>

            <LrclibSectionContainer />

            <MusicbrainzSectionContainer />
        </>
    )
})

export default VenusLyricsSettingsPage
