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
import { ArtistWithNameDto } from "@/apis/venus"
import { TextLink } from "@/app/components/link/text-link"
import { Fragment } from "react"

type ArtistsListProps = {
    artists: ArtistWithNameDto[]
    className?: string
}

export const ArtistsList = ({ artists, className }: ArtistsListProps) => {
    return artists.map((artist, i) => (
        <Fragment key={artist.id}>
            {i > 0 && (i === artists.length - 1 ? " & " : ", ")}
            <TextLink
                className={className}
                href={`/venus/artists/${artist.id}`}
            >
                {artist.name}
            </TextLink>
        </Fragment>
    ))
}
