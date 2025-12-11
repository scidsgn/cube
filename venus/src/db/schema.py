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

import enum
from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class LibraryFolder(Base):
    __tablename__ = "library_folders"

    id: Mapped[int] = mapped_column(primary_key=True)
    path: Mapped[str]
    invalid_reason: Mapped[str]

    tracks: Mapped[List["Track"]] = relationship(
        back_populates="library_folder", cascade="all, delete"
    )


class CoverArt(Base):
    __tablename__ = "cover_arts"

    id: Mapped[int] = mapped_column(primary_key=True)
    path: Mapped[str]
    digest: Mapped[bytes]
    accent_color: Mapped[str]

    artists: Mapped[List["Artist"]] = relationship(back_populates="artwork")
    albums: Mapped[List["Album"]] = relationship(back_populates="artwork")
    tracks: Mapped[List["Track"]] = relationship(back_populates="artwork")


class Artist(Base):
    __tablename__ = "artists"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    artist_tracks: Mapped[List["TrackArtist"]] = relationship(back_populates="artist")
    artist_features: Mapped[List["TrackFeature"]] = relationship(
        back_populates="artist"
    )
    artist_remixes: Mapped[List["TrackRemixer"]] = relationship(back_populates="artist")

    albums: Mapped[List["AlbumArtist"]] = relationship(back_populates="artist")

    writing_credits: Mapped[List["TrackMusicbrainzWritingCredit"]] = relationship(
        back_populates="artist"
    )
    production_credits: Mapped[List["TrackMusicbrainzProductionCredit"]] = relationship(
        back_populates="artist"
    )

    artwork_id: Mapped[Optional[id]] = mapped_column(ForeignKey("cover_arts.id"))
    artwork: Mapped[Optional["CoverArt"]] = relationship(back_populates="artists")


class Album(Base):
    __tablename__ = "albums"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    release_year: Mapped[Optional[int]]

    artists: Mapped[List["AlbumArtist"]] = relationship(
        back_populates="album", cascade="all, delete"
    )
    mb_details: Mapped[Optional["AlbumMusicbrainzDetails"]] = relationship(
        back_populates="album", cascade="all, delete"
    )

    discs: Mapped[List["Disc"]] = relationship(
        back_populates="album", cascade="all, delete"
    )

    artwork_id: Mapped[Optional[id]] = mapped_column(ForeignKey("cover_arts.id"))
    artwork: Mapped[Optional["CoverArt"]] = relationship(back_populates="albums")


class AlbumArtist(Base):
    __tablename__ = "album_artists"
    album_id: Mapped[int] = mapped_column(ForeignKey("albums.id"), primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"), primary_key=True)

    album: Mapped["Album"] = relationship(back_populates="artists")
    artist: Mapped["Artist"] = relationship(back_populates="albums")
    order: Mapped[int]


class AlbumMusicbrainzDetails(Base):
    __tablename__ = "album_musicbrainz_details"

    id: Mapped[int] = mapped_column(primary_key=True)

    album_id: Mapped[int] = mapped_column(ForeignKey("albums.id"))
    album: Mapped["Album"] = relationship(back_populates="mb_details")

    mbid: Mapped[str]
    release_type: Mapped[str]
    release_date: Mapped[date]

    genres: Mapped[List["AlbumMusicbrainzGenre"]] = relationship(
        back_populates="mb_details", cascade="all, delete"
    )
    labels: Mapped[List["AlbumMusicbrainzLabel"]] = relationship(
        back_populates="mb_details", cascade="all, delete"
    )


class MusicbrainzGenre(Base):
    __tablename__ = "musicbrainz_genres"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    albums: Mapped[List["AlbumMusicbrainzGenre"]] = relationship(back_populates="genre")
    tracks: Mapped[List["TrackMusicbrainzGenre"]] = relationship(back_populates="genre")


class AlbumMusicbrainzGenre(Base):
    __tablename__ = "album_musicbrainz_genres"

    mb_details_id: Mapped[int] = mapped_column(
        ForeignKey("album_musicbrainz_details.id"), primary_key=True
    )
    genre_id: Mapped[int] = mapped_column(
        ForeignKey("musicbrainz_genres.id"), primary_key=True
    )

    mb_details: Mapped["AlbumMusicbrainzDetails"] = relationship(
        back_populates="genres"
    )
    genre: Mapped["MusicbrainzGenre"] = relationship(back_populates="albums")
    weight: Mapped[int]


class MusicbrainzLabel(Base):
    __tablename__ = "musicbrainz_labels"

    id: Mapped[int] = mapped_column(primary_key=True)
    mbid: Mapped[str]
    name: Mapped[str]
    type: Mapped[str]

    albums: Mapped[List["AlbumMusicbrainzLabel"]] = relationship(
        back_populates="label", cascade="all, delete"
    )


class AlbumMusicbrainzLabel(Base):
    __tablename__ = "album_musicbrainz_labels"

    mb_details_id: Mapped[int] = mapped_column(
        ForeignKey("album_musicbrainz_details.id"), primary_key=True
    )
    label_id: Mapped[int] = mapped_column(
        ForeignKey("musicbrainz_labels.id"), primary_key=True
    )

    mb_details: Mapped["AlbumMusicbrainzDetails"] = relationship(
        back_populates="labels"
    )
    label: Mapped["MusicbrainzLabel"] = relationship(back_populates="albums")

    order: Mapped[int]


class Disc(Base):
    __tablename__ = "discs"

    id: Mapped[int] = mapped_column(primary_key=True)

    album_id: Mapped[int] = mapped_column(ForeignKey("albums.id"))

    disc_number: Mapped[int]

    album: Mapped["Album"] = relationship(back_populates="discs")
    tracks: Mapped[List["DiscTrack"]] = relationship(
        back_populates="disc", cascade="all, delete"
    )


class Track(Base):
    __tablename__ = "tracks"

    id: Mapped[int] = mapped_column(primary_key=True)

    file_path: Mapped[str]
    modified_at: Mapped[datetime]
    library_folder_id: Mapped[int] = mapped_column(ForeignKey("library_folders.id"))
    library_folder: Mapped["LibraryFolder"] = relationship(back_populates="tracks")

    title: Mapped[str]
    release_year: Mapped[int]
    duration: Mapped[float]

    artists: Mapped[List["TrackArtist"]] = relationship(
        back_populates="track", cascade="all, delete"
    )
    features: Mapped[List["TrackFeature"]] = relationship(
        back_populates="track", cascade="all, delete"
    )
    remixers: Mapped[List["TrackRemixer"]] = relationship(
        back_populates="track", cascade="all, delete"
    )

    mb_details: Mapped[Optional["TrackMusicbrainzDetails"]] = relationship(
        back_populates="track", cascade="all, delete"
    )
    rating: Mapped[Optional["TrackRating"]] = relationship(
        back_populates="track", cascade="all, delete"
    )
    musical_features: Mapped[Optional["TrackMusicalFeatures"]] = relationship(
        back_populates="track", cascade="all, delete"
    )

    disc_track: Mapped[Optional["DiscTrack"]] = relationship(
        back_populates="track", cascade="all, delete"
    )

    lyrics: Mapped[Optional["TrackLyrics"]] = relationship(
        back_populates="track", cascade="all, delete"
    )

    artwork_id: Mapped[Optional[id]] = mapped_column(ForeignKey("cover_arts.id"))
    artwork: Mapped[Optional["CoverArt"]] = relationship(back_populates="tracks")

    track_musical_estimation_jobs: Mapped[List["TrackMusicalEstimationJob"]] = (
        relationship(back_populates="track", cascade="all, delete")
    )
    track_lyrics_jobs: Mapped[List["TrackLyricsJob"]] = relationship(
        back_populates="track", cascade="all, delete"
    )

    playlist_tracks: Mapped[List["PlaylistTrack"]] = relationship(
        back_populates="track", cascade="all, delete"
    )


class TrackMusicbrainzDetails(Base):
    __tablename__ = "track_musicbrainz_details"

    id: Mapped[int] = mapped_column(primary_key=True)

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))
    track: Mapped["Track"] = relationship(back_populates="mb_details")

    mbid: Mapped[str]

    writing_credits: Mapped[List["TrackMusicbrainzWritingCredit"]] = relationship(
        back_populates="mb_details", cascade="all, delete"
    )
    production_credits: Mapped[List["TrackMusicbrainzProductionCredit"]] = relationship(
        back_populates="mb_details", cascade="all, delete"
    )
    genres: Mapped[List["TrackMusicbrainzGenre"]] = relationship(
        back_populates="mb_details", cascade="all, delete"
    )


class TrackMusicbrainzWritingCredit(Base):
    __tablename__ = "track_musicbrainz_writing_credits"

    id: Mapped[int] = mapped_column(primary_key=True)

    mb_details_id: Mapped[int] = mapped_column(
        ForeignKey("track_musicbrainz_details.id")
    )
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"))

    mb_details: Mapped["TrackMusicbrainzDetails"] = relationship(
        back_populates="writing_credits"
    )
    artist: Mapped["Artist"] = relationship(back_populates="writing_credits")


class TrackMusicbrainzProductionCredit(Base):
    __tablename__ = "track_musicbrainz_production_credits"

    id: Mapped[int] = mapped_column(primary_key=True)

    mb_details_id: Mapped[int] = mapped_column(
        ForeignKey("track_musicbrainz_details.id")
    )
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"))

    mb_details: Mapped["TrackMusicbrainzDetails"] = relationship(
        back_populates="production_credits"
    )
    artist: Mapped["Artist"] = relationship(back_populates="production_credits")

    type: Mapped[str]
    description: Mapped[str]


class TrackMusicbrainzGenre(Base):
    __tablename__ = "track_musicbrainz_genres"

    mb_details_id: Mapped[int] = mapped_column(
        ForeignKey("track_musicbrainz_details.id"), primary_key=True
    )
    genre_id: Mapped[int] = mapped_column(
        ForeignKey("musicbrainz_genres.id"), primary_key=True
    )

    mb_details: Mapped["TrackMusicbrainzDetails"] = relationship(
        back_populates="genres"
    )
    genre: Mapped["MusicbrainzGenre"] = relationship(back_populates="tracks")


class TrackRating(Base):
    __tablename__ = "track_ratings"

    id: Mapped[int] = mapped_column(primary_key=True)

    play_count: Mapped[int]
    rating: Mapped[int]

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))
    track: Mapped["Track"] = relationship(back_populates="rating")


class TrackMusicalFeatures(Base):
    __tablename__ = "track_musical_features"

    id: Mapped[int] = mapped_column(primary_key=True)

    modified_at: Mapped[datetime]

    bpm: Mapped[float]
    key: Mapped[str]
    scale: Mapped[str]
    camelot_index: Mapped[int]

    waveform: Mapped[bytes]

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))
    track: Mapped["Track"] = relationship(back_populates="musical_features")


class DiscTrack(Base):
    __tablename__ = "disc_tracks"

    disc_id: Mapped[int] = mapped_column(ForeignKey("discs.id"), primary_key=True)
    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"), primary_key=True)

    disc: Mapped["Disc"] = relationship(back_populates="tracks")
    track: Mapped["Track"] = relationship(back_populates="disc_track")

    order: Mapped[int]


class TrackArtist(Base):
    __tablename__ = "track_artists"

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"), primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"), primary_key=True)

    track: Mapped["Track"] = relationship(back_populates="artists")
    artist: Mapped["Artist"] = relationship(back_populates="artist_tracks")

    order: Mapped[int]


class TrackFeature(Base):
    __tablename__ = "track_features"

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"), primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"), primary_key=True)

    track: Mapped["Track"] = relationship(back_populates="features")
    artist: Mapped["Artist"] = relationship(back_populates="artist_features")

    order: Mapped[int]


class TrackRemixer(Base):
    __tablename__ = "track_remixers"

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"), primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"), primary_key=True)

    track: Mapped["Track"] = relationship(back_populates="remixers")
    artist: Mapped["Artist"] = relationship(back_populates="artist_remixes")

    order: Mapped[int]


class TrackLyrics(Base):
    __tablename__ = "track_lyrics"

    id: Mapped[int] = mapped_column(primary_key=True)

    key: Mapped[str]

    plain_lyrics: Mapped[Optional[str]]
    synced_lyrics: Mapped[Optional[str]]

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))
    track: Mapped["Track"] = relationship(back_populates="lyrics")


class ScanStatus(enum.Enum):
    started = "started"
    completed = "completed"
    failed = "failed"
    interrupted = "interrupted"


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[ScanStatus]

    enqueued_at: Mapped[datetime]
    started_at: Mapped[Optional[datetime]]
    ended_at: Mapped[Optional[datetime]]

    tracks_import_job: Mapped[Optional["TracksImportJob"]] = relationship(
        back_populates="scan", cascade="all, delete"
    )
    track_musical_estimation_jobs: Mapped[List["TrackMusicalEstimationJob"]] = (
        relationship(back_populates="scan", cascade="all, delete")
    )
    track_lyrics_jobs: Mapped[List["TrackLyricsJob"]] = relationship(
        back_populates="scan", cascade="all, delete"
    )


class OngoingOperationStatus(enum.Enum):
    enqueued = "enqueued"
    started = "started"
    completed = "completed"
    failed = "failed"
    skipped = "skipped"


class TracksImportJob(Base):
    __tablename__ = "tracks_import_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[OngoingOperationStatus]

    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"))
    scan: Mapped["Scan"] = relationship(back_populates="tracks_import_job")

    upserted_tracks: Mapped[int]
    deleted_tracks: Mapped[int]

    enqueued_at: Mapped[datetime]
    started_at: Mapped[Optional[datetime]]
    ended_at: Mapped[Optional[datetime]]


class TrackMusicalEstimationJob(Base):
    __tablename__ = "track_musical_estimation_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[OngoingOperationStatus]
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"))
    scan: Mapped["Scan"] = relationship(back_populates="track_musical_estimation_jobs")

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))
    track: Mapped["Track"] = relationship(
        back_populates="track_musical_estimation_jobs"
    )

    enqueued_at: Mapped[datetime]
    started_at: Mapped[Optional[datetime]]
    ended_at: Mapped[Optional[datetime]]


class TrackLyricsJob(Base):
    __tablename__ = "track_lyrics_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    status: Mapped[OngoingOperationStatus]
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"))
    scan: Mapped["Scan"] = relationship(back_populates="track_lyrics_jobs")

    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))
    track: Mapped["Track"] = relationship(back_populates="track_lyrics_jobs")

    enqueued_at: Mapped[datetime]
    started_at: Mapped[Optional[datetime]]
    ended_at: Mapped[Optional[datetime]]


class NoSplitEntry(Base):
    __tablename__ = "no_split_entries"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    added_at: Mapped[datetime]
    updated_at: Mapped[datetime]


class MusicalAnalysisLevel(enum.Enum):
    none = "none"
    basic = "basic"
    full = "full"


class LibraryScanSettings(Base):
    __tablename__ = "library_scan_settings"

    id: Mapped[int] = mapped_column(primary_key=True)

    extract_track_features: Mapped[bool]
    split_artists: Mapped[bool]

    updated_at: Mapped[datetime]


class MusicalAnalysisSettings(Base):
    __tablename__ = "music_estimation_settings"

    id: Mapped[int] = mapped_column(primary_key=True)

    level: Mapped[MusicalAnalysisLevel]


class LyricsFetchSettings(Base):
    __tablename__ = "lyrics_fetch_settings"

    id: Mapped[int] = mapped_column(primary_key=True)

    fetch_lyrics: Mapped[bool]
    lrclib_api_url: Mapped[str]


class MusicbrainzFetchSettings(Base):
    __tablename__ = "musicbrainz_fetch_settings"

    id: Mapped[int] = mapped_column(primary_key=True)

    fetch_musicbrainz_data: Mapped[bool]
    musicbrainz_hostname: Mapped[str]


class Playlist(Base):
    __tablename__ = "playlists"

    id: Mapped[int] = mapped_column(primary_key=True)

    author: Mapped[UUID]

    name: Mapped[str]
    created_at: Mapped[datetime]
    updated_at: Mapped[datetime]

    tracks: Mapped[List["PlaylistTrack"]] = relationship(
        back_populates="playlist", cascade="all, delete"
    )


class PlaylistTrack(Base):
    __tablename__ = "playlist_tracks"

    id: Mapped[int] = mapped_column(primary_key=True)

    playlist_id: Mapped[int] = mapped_column(ForeignKey("playlists.id"))
    track_id: Mapped[int] = mapped_column(ForeignKey("tracks.id"))

    playlist: Mapped["Playlist"] = relationship(back_populates="tracks")
    track: Mapped["Track"] = relationship(back_populates="playlist_tracks")

    order: Mapped[int]
