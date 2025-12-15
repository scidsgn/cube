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

import { SettingsSection } from "@/app/settings/components/settings-section"
import { LinkButton } from "@/app/components/button/button"

const AboutSettingsPage = () => {
    return (
        <>
            <SettingsSection name="Version">
                <div className="flex items-center gap-3">
                    <svg width={36} height={36} className="fill-accent-600">
                        <g transform="matrix(0.75,0,0,0.75,0,1.20792e-13)">
                            <path d="M48,0L48,48L0,48L0,0L48,0ZM10.667,10.627L10.667,33.522L5.333,38.855L5.333,42.627L9.105,42.627L19.731,32L19.755,31.96L16,31.96L16,15.96L32,15.96L32,31.96L21.333,31.96L21.333,37.293L37.333,37.293L37.333,10.627L10.667,10.627ZM10.667,10.627L10.667,5.293L5.333,5.293L5.333,10.627L10.667,10.627ZM37.333,10.627L42.667,10.627L42.667,5.293L37.333,5.293L37.333,10.627ZM37.333,37.293L37.333,42.627L42.667,42.627L42.667,37.293L37.333,37.293ZM26.667,21.293L21.333,21.293L21.333,26.627L26.667,26.627L26.667,21.293Z" />
                        </g>
                    </svg>
                    <span className="text-accent-600 text-2xl font-semibold">
                        CUBE
                    </span>
                    <span className="text-accent-600 -ml-2 text-2xl font-medium">
                        Alpha
                    </span>
                </div>

                <p className="font-medium">
                    You are running a test release of CUBE. Expect bugs and
                    stuff. Or if you&#39;re me, fix the bugs and stuff.
                </p>

                <LinkButton
                    className="self-start"
                    href="https://github.com/scidsgn/cube"
                    target="_blank"
                    rel="noopener noreferrer"
                    icon="code"
                >
                    Source code on GitHub
                </LinkButton>
            </SettingsSection>
        </>
    )
}

export default AboutSettingsPage
