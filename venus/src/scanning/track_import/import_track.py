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

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.schema import (
    Track,
    TrackArtist,
    TrackFeature,
    TrackRemixer,
    DiscTrack,
    TrackRating,
    LibraryFolder,
)
from src.analysis.musical_analysis import MusicalAnalysisResult
from src.scanning.track_import.import_artist import import_artist
from src.scanning.track_import.import_cover_art import import_cover_art
from src.scanning.track_import.import_disc import import_disc
from src.scanning.track_import.import_musical_features import (
    import_musical_features,
)
from src.metadata.metadata_model import MetadataTrack


def purge_track_artists(track: Track, session: Session):
    for artist in track.artists:
        session.delete(artist)

    for feature in track.features:
        session.delete(feature)

    for remixer in track.remixers:
        session.delete(remixer)


def insert_track_artists(track: Track, metadata_track: MetadataTrack, session: Session):
    for order, artist in enumerate(metadata_track.artists):
        session.add(
            TrackArtist(track=track, artist=import_artist(artist, session), order=order)
        )

    for order, artist in enumerate(metadata_track.features):
        session.add(
            TrackFeature(
                track=track, artist=import_artist(artist, session), order=order
            )
        )

    for order, artist in enumerate(metadata_track.remixers):
        session.add(
            TrackRemixer(
                track=track, artist=import_artist(artist, session), order=order
            )
        )


def get_existing(metadata_track: MetadataTrack, session: Session) -> Track | None:
    track_q = select(Track).where(Track.file_path == metadata_track.file_path)

    return session.execute(track_q).scalar()


def update(
    metadata_track: MetadataTrack,
    track: Track,
    analysis_result: MusicalAnalysisResult | None,
    library_folder: LibraryFolder,
    modified_at: datetime,
    session: Session,
):
    track.modified_at = modified_at
    track.title = metadata_track.title
    track.release_year = metadata_track.release_year
    track.duration = metadata_track.duration
    track.library_folder_id = library_folder.id

    purge_track_artists(track, session)
    insert_track_artists(track, metadata_track, session)

    import_musical_features(track, analysis_result, session)

    if metadata_track.disc and metadata_track.track_number:
        disc = import_disc(metadata_track.disc, session)

        if track.disc_track:
            track.disc_track.disc = disc
            track.disc_track.order = metadata_track.track_number
        else:
            session.add(
                DiscTrack(disc=disc, track=track, order=metadata_track.track_number)
            )
    else:
        if track.disc_track:
            session.delete(track.disc_track)

    if metadata_track.artwork is None and track.artwork is not None:
        track.artwork_id = None

    if metadata_track.artwork is not None:
        cover_art = import_cover_art(metadata_track.artwork, session)
        track.artwork = cover_art


def create(
    metadata_track: MetadataTrack,
    analysis_result: MusicalAnalysisResult | None,
    library_folder: LibraryFolder,
    modified_at: datetime,
    session: Session,
) -> Track:
    track = Track(
        file_path=metadata_track.file_path,
        modified_at=modified_at,
        library_folder_id=library_folder.id,
        title=metadata_track.title,
        release_year=metadata_track.release_year,
        duration=metadata_track.duration,
    )
    insert_track_artists(track, metadata_track, session)

    import_musical_features(track, analysis_result, session)

    session.add(TrackRating(track=track, play_count=0, rating=0))

    if metadata_track.disc and metadata_track.track_number:
        disc = import_disc(metadata_track.disc, session)
        session.add(
            DiscTrack(disc=disc, track=track, order=metadata_track.track_number)
        )

    if metadata_track.artwork is not None:
        cover_art = import_cover_art(metadata_track.artwork, session)
        track.artwork = cover_art

    return track


def import_track(
    metadata_track: MetadataTrack,
    analysis_result: MusicalAnalysisResult | None,
    library_folder: LibraryFolder,
    modified_at: datetime,
    session: Session,
) -> Track:
    track = get_existing(metadata_track, session)

    if track is not None:
        update(
            metadata_track, track, analysis_result, library_folder, modified_at, session
        )
        session.flush()
        return track

    track = create(
        metadata_track, analysis_result, library_folder, modified_at, session
    )
    session.flush()

    return track
