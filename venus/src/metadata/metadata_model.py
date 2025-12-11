#  CUBE
#  Copyright (C) 2025  scidsgn
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU Affero General Public License as published
#  by the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU Affero General Public License for more details.
#  You should have received a copy of the GNU Affero General Public License
#  along with this program.  If not, see <https://www.gnu.org/licenses/>.

from dataclasses import dataclass

import music_tag


@dataclass
class MetadataArtist:
    name: str

    def __hash__(self):
        return hash(self.name.lower())

    def __eq__(self, other):
        if not isinstance(other, MetadataArtist):
            return False

        return hash(self) == hash(other)


@dataclass
class MetadataAlbum:
    title: str
    artists: list[MetadataArtist]
    release_year: int | None
    artwork: music_tag.Artwork | None

    def __hash__(self):
        return hash((self.title, tuple(self.artists)))

    def __eq__(self, other):
        if not isinstance(other, MetadataAlbum):
            return False

        return hash(self) == hash(other)


@dataclass
class MetadataDisc:
    album: MetadataAlbum
    disc_number: int

    def __hash__(self):
        return hash((self.album, self.disc_number))

    def __eq__(self, other):
        if not isinstance(other, MetadataDisc):
            return False

        return hash(self) == hash(other)


@dataclass
class MetadataTrack:
    file_path: str

    duration: float

    title: str
    release_year: int

    artists: list[MetadataArtist]
    features: list[MetadataArtist]
    remixers: list[MetadataArtist]

    disc: MetadataDisc | None
    track_number: int | None

    artwork: music_tag.Artwork | None

    def __hash__(self):
        return hash(self.file_path)

    def __eq__(self, other):
        if not isinstance(other, MetadataTrack):
            return False

        return hash(self) == hash(other)
