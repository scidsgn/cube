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
from itertools import chain


@dataclass
class TrackWritingCredit:
    artist_mbid: str
    artist_name: str


@dataclass
class TrackProductionCredit:
    artist_mbid: str
    artist_name: str
    type: str
    description: str


def gather_writing_credits(artist_rels) -> list[TrackWritingCredit]:
    people_credits = {
        rel["artist"]["id"]: TrackWritingCredit(
            artist_mbid=rel["artist"]["id"], artist_name=rel["artist"]["name"]
        )
        for rel in artist_rels
    }

    return list(people_credits.values())


def gather_artist_credits(artist_rels) -> list[TrackProductionCredit]:
    artist_names = {rel["artist"]["id"]: rel["artist"]["name"] for rel in artist_rels}
    people_credits = {
        id: collapse_individual_credits(
            [
                artist_credit_from_relation(credit)
                for credit in artist_rels
                if credit["artist"]["id"] == id
            ]
        )
        for id in artist_names.keys()
    }

    return list(chain.from_iterable(people_credits.values()))


def artist_credit_from_relation(relation):
    return TrackProductionCredit(
        artist_mbid=relation["artist"]["id"],
        artist_name=relation["artist"]["name"],
        type=relation["type"],
        description=", ".join(
            relation["attribute-list"] if "attribute-list" in relation else []
        ),
    )


def collapse_individual_credits(
    credits: list[TrackProductionCredit],
) -> list[TrackProductionCredit]:
    if len(credits) == 0:
        return []

    artist_mbid = credits[0].artist_mbid
    artist_name = credits[0].artist_name
    credit_types = {credit.type for credit in credits}

    return [
        TrackProductionCredit(
            artist_mbid=artist_mbid,
            artist_name=artist_name,
            type=type,
            description=", ".join(
                sorted(
                    [credit.description for credit in credits if credit.type == type]
                )
            ),
        )
        for type in credit_types
    ]
