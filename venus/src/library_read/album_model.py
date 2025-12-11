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

from datetime import date

from pydantic import BaseModel

from src.db.schema import (
    Disc,
    Album,
    AlbumMusicbrainzDetails,
    Track,
    TrackMusicalFeatures,
)
from src.library_read.artist_model import ArtistWithNameDto
from src.library_read.cover_art_model import CoverArtDto, resolve_track_artwork
from src.library_read.mb_model import MusicbrainzLabelDto, MusicbrainzGenreDto


class AlbumTrackMusicalFeaturesDto(BaseModel):
    bpm: float
    key: str
    scale: str
    camelot_index: int

    @staticmethod
    def from_entity(features: TrackMusicalFeatures):
        return AlbumTrackMusicalFeaturesDto(
            bpm=features.bpm,
            key=features.key,
            scale=features.scale,
            camelot_index=features.camelot_index,
        )


class AlbumTrackDto(BaseModel):
    id: int
    title: str
    release_year: int
    duration: float
    artists: list[ArtistWithNameDto]
    features: list[ArtistWithNameDto]
    remixers: list[ArtistWithNameDto]

    musical_features: AlbumTrackMusicalFeaturesDto | None

    artwork: CoverArtDto | None

    track_number: int

    @staticmethod
    def from_entity(track: Track):
        return AlbumTrackDto(
            id=track.id,
            title=track.title,
            release_year=track.release_year,
            duration=track.duration,
            artists=[
                ArtistWithNameDto.from_entity(artist.artist)
                for artist in sorted(track.artists, key=lambda a: a.order)
            ],
            features=[
                ArtistWithNameDto.from_entity(artist.artist)
                for artist in sorted(track.features, key=lambda a: a.order)
            ],
            remixers=[
                ArtistWithNameDto.from_entity(artist.artist)
                for artist in sorted(track.remixers, key=lambda a: a.order)
            ],
            musical_features=AlbumTrackMusicalFeaturesDto.from_entity(
                track.musical_features
            )
            if track.musical_features is not None
            else None,
            artwork=resolve_track_artwork(track),
            track_number=track.disc_track.order
        )


class AlbumDiscDto(BaseModel):
    id: int
    disc_number: int
    track_count: int

    tracks: list[AlbumTrackDto]

    @staticmethod
    def from_entity(disc: Disc):
        return AlbumDiscDto(
            id=disc.id,
            disc_number=disc.disc_number,
            track_count=len(disc.tracks),
            tracks=[
                AlbumTrackDto.from_entity(track.track)
                for track in sorted(disc.tracks, key=lambda t: t.order)
            ],
        )


class AlbumDto(BaseModel):
    id: int
    title: str
    artists: list[ArtistWithNameDto]
    release_year: int | None

    artwork: CoverArtDto | None

    @staticmethod
    def from_entity(album: Album):
        return AlbumDto(
            id=album.id,
            title=album.title,
            artists=[
                ArtistWithNameDto.from_entity(artist.artist)
                for artist in sorted(album.artists, key=lambda a: a.order)
            ],
            release_year=album.release_year,
            artwork=CoverArtDto.from_entity(album.artwork) if album.artwork else None,
        )


class AlbumMusicbrainzDetailsDto(BaseModel):
    mbid: str
    release_type: str
    release_date: date

    labels: list[MusicbrainzLabelDto]
    genres: list[MusicbrainzGenreDto]

    @staticmethod
    def from_entity(mb_details: AlbumMusicbrainzDetails):
        return AlbumMusicbrainzDetailsDto(
            mbid=mb_details.mbid,
            release_type=mb_details.release_type,
            release_date=mb_details.release_date,
            labels=[
                MusicbrainzLabelDto.from_entity(label.label)
                for label in sorted(mb_details.labels, key=lambda d: d.order)
            ],
            genres=[
                MusicbrainzGenreDto.from_entity(genre.genre)
                for genre in sorted(mb_details.genres, key=lambda d: -d.weight)
            ],
        )


class AlbumWithDetailsDto(BaseModel):
    id: int
    title: str
    artists: list[ArtistWithNameDto]
    release_year: int | None
    discs: list[AlbumDiscDto]

    artwork: CoverArtDto | None

    mb_details: AlbumMusicbrainzDetailsDto | None

    @staticmethod
    def from_entity(album: Album):
        return AlbumWithDetailsDto(
            id=album.id,
            title=album.title,
            artists=[
                ArtistWithNameDto.from_entity(artist.artist)
                for artist in sorted(album.artists, key=lambda a: a.order)
            ],
            release_year=album.release_year,
            discs=[
                AlbumDiscDto.from_entity(disc)
                for disc in sorted(album.discs, key=lambda d: d.disc_number)
            ],
            mb_details=AlbumMusicbrainzDetailsDto.from_entity(album.mb_details)
            if album.mb_details is not None
            else None,
            artwork=CoverArtDto.from_entity(album.artwork) if album.artwork else None,
        )


class AlbumsResponse(BaseModel):
    albums: list[AlbumDto]

    @staticmethod
    def from_entity(albums: list[Album]):
        return AlbumsResponse(albums=[AlbumDto.from_entity(album) for album in albums])
