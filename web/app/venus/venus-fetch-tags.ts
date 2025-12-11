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

export enum VenusFetchTags {
    libraryFolders = "venus-library-folders",
    scanSettings = "venus-scan-settings",
    musicalAnalysisSettings = "venus-musical-analysis-settings",
    lyricsSettings = "venus-lyrics-settings",
    noSplitList = "venus-no-split-list",
    musicbrainzSettings = "venus-musicbrainz-settings",
}

export function venusPlaylistFetchTag(playlistId: number) {
    return `venus-playlist-${playlistId}`
}
