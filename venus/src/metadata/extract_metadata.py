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

import music_tag

from src.metadata.extract_features import extract_features
from src.metadata.extract_settings import ExtractMetadataSettings
from src.metadata.metadata_model import (
    MetadataAlbum,
    MetadataDisc,
    MetadataTrack,
    MetadataArtist,
)
from src.metadata.split_artists import split_artists


def extract_metadata_from_file(file_path: str, settings: ExtractMetadataSettings):
    try:
        music_file = music_tag.load_file(file_path)

        title_features = extract_features(music_file["tracktitle"].value, settings)
        artist_features = extract_features(music_file["artist"].value, settings)

        album_title = music_file["album"].value
        album_artists = music_file["albumartist"].value
        disc_number = music_file["discnumber"].value
        track_number = music_file["tracknumber"].value

        album = (
            MetadataAlbum(
                title=album_title,
                artists=artists_from_list(split_artists(album_artists, settings)),
                artwork=music_file["artwork"].first if music_file["artwork"] else None,
                release_year=music_file["year"].value if music_file["year"] else None,
            )
            if album_title and album_artists
            else None
        )

        disc = (
            MetadataDisc(album=album, disc_number=disc_number if disc_number else 1)
            if album
            else None
        )

        return MetadataTrack(
            file_path=file_path,
            duration=music_file["#length"].value,
            title=title_features.actual_value,
            release_year=music_file["year"].value,
            artists=artists_from_list(
                split_artists(artist_features.actual_value, settings)
            ),
            features=artists_from_list(
                title_features.features + artist_features.features
            ),
            remixers=artists_from_list(
                title_features.remixers + artist_features.remixers
            ),
            disc=disc,
            track_number=track_number if track_number else None,
            artwork=music_file["artwork"].first if music_file["artwork"] else None,
        )

    except NotImplementedError:
        pass


def artists_from_list(artists: list[str]):
    return [MetadataArtist(artist) for artist in unique(artists)]


def unique[T](items: list[T]):
    return list(dict.fromkeys(items))
