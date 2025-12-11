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

import hashlib
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from PIL import Image
from colorgram import Color, extract
from music_tag import Artwork
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.db.schema import CoverArt
from src.env import env


@dataclass
class SavedArtwork:
    image_path: str
    accent_color: str


def color_to_hex(color: Color):
    return "#{0:02x}{1:02x}{2:02x}".format(color.rgb.r, color.rgb.g, color.rgb.b)


def extract_accent_color(image: Image.Image):
    colors = extract(image, 5)
    sorted_colors = sorted(colors, key=lambda color: -color.hsl.s * color.proportion)

    return color_to_hex(sorted_colors[0])


def get_existing(digest: bytes, session: Session) -> CoverArt | None:
    cover_art_q = select(CoverArt).where(CoverArt.digest == digest)

    return session.execute(cover_art_q).scalar()


def create(image: Image.Image, digest: bytes, session: Session) -> CoverArt:
    image_path = Path(env.INDEX_FOLDER) / "covers" / f"{uuid4()}.png"

    image.thumbnail((512, 512))
    image.save(image_path)

    accent_color = extract_accent_color(image)

    cover_art = CoverArt(path=str(image_path), digest=digest, accent_color=accent_color)
    session.add(cover_art)

    return cover_art


def import_cover_art_bare(
    artwork_data: bytes, artwork_image: Image.Image, session: Session
) -> CoverArt:
    artwork_hash = hashlib.md5(artwork_data)
    artwork_digest = artwork_hash.digest()

    cover_art = get_existing(artwork_digest, session)
    if cover_art is not None:
        return cover_art

    cover_art = create(artwork_image, artwork_digest, session)
    session.flush()

    return cover_art
    pass


def import_cover_art(artwork: Artwork, session: Session) -> CoverArt:
    return import_cover_art_bare(
        artwork_image=artwork.image, artwork_data=artwork.data, session=session
    )
