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

from src.db.schema import (
    TrackMusicalFeatures,
    TrackMusicbrainzProductionCredit,
    TrackMusicbrainzDetails,
    Track,
    TrackLyrics,
)
from src.library_read.artist_model import ArtistWithNameDto
from src.library_read.cover_art_model import CoverArtDto, resolve_track_artwork
from src.library_read.disc_model import DiscDto, DiscTrackDto
from src.library_read.mb_model import MusicbrainzGenreDto
from src.lyrics.lyrics_model import SyncedLyrics


class TrackMusicalFeaturesDto(BaseModel):
    bpm: float
    key: str
    scale: str
    camelot_index: int

    @staticmethod
    def from_entity(features: TrackMusicalFeatures):
        return TrackMusicalFeaturesDto(
            bpm=features.bpm,
            key=features.key,
            scale=features.scale,
            camelot_index=features.camelot_index,
        )


class TrackMusicbrainzProductionCreditDto(BaseModel):
    artist: ArtistWithNameDto
    type: str
    description: str

    @staticmethod
    def from_entity(credit: TrackMusicbrainzProductionCredit):
        return TrackMusicbrainzProductionCreditDto(
            artist=ArtistWithNameDto.from_entity(credit.artist),
            type=credit.type,
            description=credit.description,
        )


class TrackMusicbrainzDetailsDto(BaseModel):
    mbid: str
    writing_credits: list[ArtistWithNameDto]
    production_credits: list[TrackMusicbrainzProductionCreditDto]
    genres: list[MusicbrainzGenreDto]

    @staticmethod
    def from_entity(mb_details: TrackMusicbrainzDetails):
        return TrackMusicbrainzDetailsDto(
            mbid=mb_details.mbid,
            writing_credits=[
                ArtistWithNameDto.from_entity(credit.artist)
                for credit in mb_details.writing_credits
            ],
            production_credits=[
                TrackMusicbrainzProductionCreditDto.from_entity(credit)
                for credit in mb_details.production_credits
            ],
            genres=[
                MusicbrainzGenreDto.from_entity(genre.genre)
                for genre in mb_details.genres
            ],
        )


class TrackDto(BaseModel):
    id: int
    title: str
    release_year: int
    duration: float
    artists: list[ArtistWithNameDto]
    features: list[ArtistWithNameDto]
    remixers: list[ArtistWithNameDto]

    disc_track: DiscTrackDto | None

    musical_features: TrackMusicalFeaturesDto | None
    has_lyrics: bool

    artwork: CoverArtDto | None

    mb_details: TrackMusicbrainzDetailsDto | None

    @staticmethod
    def from_entity(track: Track):
        return TrackDto(
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
            disc_track=DiscTrackDto(
                disc=DiscDto.from_entity(track.disc_track.disc),
                track_number=track.disc_track.order,
            )
            if track.disc_track is not None
            else None,
            musical_features=TrackMusicalFeaturesDto.from_entity(track.musical_features)
            if track.musical_features is not None
            else None,
            has_lyrics=track.lyrics is not None,
            mb_details=TrackMusicbrainzDetailsDto.from_entity(track.mb_details)
            if track.mb_details is not None
            else None,
            artwork=resolve_track_artwork(track),
        )


class TrackBasicDto(BaseModel):
    title: str
    artists: list[str]

    @staticmethod
    def from_entity(track: Track):
        return TrackBasicDto(
            title=track.title,
            artists=[
                artist.artist.name
                for artist in sorted(track.artists, key=lambda a: a.order)
            ],
        )


class TracksResponse(BaseModel):
    tracks: list[TrackDto]


class TrackWaveformDto(BaseModel):
    waveform: list[int]

    @staticmethod
    def from_entity(waveform: list[int]):
        return TrackWaveformDto(waveform=waveform)


class TrackLyricsDto(BaseModel):
    plain_lyrics: str | None
    synced_lyrics: SyncedLyrics | None

    @staticmethod
    def from_entity(lyrics: TrackLyrics):
        return TrackLyricsDto(
            plain_lyrics=lyrics.plain_lyrics,
            synced_lyrics=SyncedLyrics.model_validate_json(lyrics.synced_lyrics)
            if lyrics.synced_lyrics is not None
            else None,
        )
