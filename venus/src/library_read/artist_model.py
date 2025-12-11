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

from pydantic import BaseModel

from src.db.schema import Artist
from src.library_read.cover_art_model import CoverArtDto


class ArtistWithNameDto(BaseModel):
    id: int
    name: str

    artwork: CoverArtDto | None

    @staticmethod
    def from_entity(artist: Artist):
        return ArtistWithNameDto(
            id=artist.id,
            name=artist.name,
            artwork=CoverArtDto.from_entity(artist.artwork) if artist.artwork else None,
        )


class ArtistWithDetailsDto(BaseModel):
    id: int
    name: str

    album_count: int

    track_count: int
    feature_count: int
    remix_count: int

    production_credit_count: int
    writing_credit_count: int

    artwork: CoverArtDto | None

    @staticmethod
    def from_entity(artist: Artist):
        return ArtistWithDetailsDto(
            id=artist.id,
            name=artist.name,
            album_count=len(artist.albums),
            track_count=len(artist.artist_tracks),
            feature_count=len(artist.artist_features),
            remix_count=len(artist.artist_remixes),
            production_credit_count=len(artist.production_credits),
            writing_credit_count=len(artist.writing_credits),
            artwork=CoverArtDto.from_entity(artist.artwork) if artist.artwork else None,
        )


class ArtistsResponse(BaseModel):
    artists: list[ArtistWithDetailsDto]

    @staticmethod
    def from_entity(artists: list[Artist]):
        return ArtistsResponse(
            artists=[ArtistWithDetailsDto.from_entity(artist) for artist in artists]
        )
