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

"use client"

import { CSS } from "@dnd-kit/utilities"
import { PlaylistTrackDto, PlaylistWithTracksDto } from "@/apis/venus"
import { PlaylistItem } from "@/app/venus/playlists/[id]/playlist-item"
import { DetailedHTMLProps, HTMLAttributes, useMemo, useState } from "react"
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { IconSymbol } from "@/app/components/icon/icon-symbol"
import { TracklistHeader } from "@/app/venus/components/tracklist/tracklist-header"
import { PlaybackBaseTrack } from "@/app/venus/playback/playback-queue-store"
import { reorderPlaylistTracksAction } from "@/app/venus/playlists/playlist-actions"
import { useAction } from "@/app/action/use-action"
import { venusErrorMapper } from "@/app/venus/venus-error-mapper"

import { debounce } from "lodash"

type PlaylistTracksProps = {
    playlist: PlaylistWithTracksDto
}

export const PlaylistTracks = ({ playlist }: PlaylistTracksProps) => {
    const [activeId, setActiveId] = useState<number | null>(null)
    const [tracks, setTracks] = useState(playlist.playlist_tracks)

    const reorderPlaylistTracks = useAction(
        reorderPlaylistTracksAction,
        venusErrorMapper,
    )

    const debouncedReorderTracks = useMemo(
        () => debounce(reorderPlaylistTracks.run, 500),
        [reorderPlaylistTracks],
    )

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    const activeTrack = useMemo(
        () => tracks.find((track) => track.id === activeId),
        [tracks, activeId],
    )

    const surroundingTracks = useMemo(
        () => tracks.map((track) => track.track),
        [tracks],
    )

    return (
        <>
            <div className="sticky top-0 z-50 flex flex-col gap-2 bg-gray-950 pl-5">
                <TracklistHeader
                    columns={["artists", "album", "tempo", "key"]}
                    showTrackNumber
                />
            </div>
            <div className="flex flex-col gap-0.5">
                <DndContext
                    id={`playlist-draggable-${playlist.id}`}
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={(e) => {
                        if (e.active) {
                            setActiveId(e.active.id as number)
                        }
                    }}
                    onDragEnd={(e) => {
                        const { active, over } = e

                        if (over && active.id !== over.id) {
                            const oldIndex = tracks.findIndex(
                                (track) => track.id === active.id,
                            )
                            const newIndex = tracks.findIndex(
                                (track) => track.id === over.id,
                            )

                            const newTracks = arrayMove(
                                tracks,
                                oldIndex,
                                newIndex,
                            )

                            setTracks(newTracks)
                            debouncedReorderTracks(
                                playlist.id,
                                newTracks.map((track) => track.id),
                            )
                        }

                        setActiveId(null)
                    }}
                >
                    <SortableContext
                        items={tracks}
                        strategy={verticalListSortingStrategy}
                    >
                        {tracks.map((track) => (
                            <PlaylistTracksDraggableItem
                                key={track.id}
                                playlist={playlist}
                                track={track}
                                active={track.id === activeId}
                                surroundingTracks={surroundingTracks}
                            />
                        ))}
                    </SortableContext>
                    <DragOverlay>
                        {activeTrack && (
                            <PlaylistTracksItem
                                playlist={playlist}
                                track={activeTrack}
                            />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
        </>
    )
}

type PlaylistTracksDraggableItemProps = {
    playlist: PlaylistWithTracksDto
    track: PlaylistTrackDto
    surroundingTracks?: PlaybackBaseTrack[]
    active: boolean
}

const PlaylistTracksDraggableItem = ({
    playlist,
    track,
    surroundingTracks,
    active,
}: PlaylistTracksDraggableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id: track.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: active ? 0 : 1,
    }

    return (
        <PlaylistTracksItem
            playlist={playlist}
            track={track}
            surroundingTracks={surroundingTracks}
            itemProps={{
                ...attributes,
                style,
                ref: setNodeRef,
            }}
            handleProps={{
                ...listeners,
                ref: setActivatorNodeRef,
            }}
        />
    )
}

type PlaylistTracksItemProps = {
    playlist: PlaylistWithTracksDto
    track: PlaylistTrackDto
    surroundingTracks?: PlaybackBaseTrack[]
    itemProps?: DetailedHTMLProps<
        HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
    handleProps?: DetailedHTMLProps<
        HTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    >
}

const PlaylistTracksItem = ({
    playlist,
    track,
    surroundingTracks,
    itemProps,
    handleProps,
}: PlaylistTracksItemProps) => {
    return (
        <div className="grid grid-cols-[auto_1fr] bg-gray-950" {...itemProps}>
            <button
                type="button"
                className="flex h-9 items-center text-gray-400"
                {...handleProps}
            >
                <IconSymbol icon="drag_indicator" size={20} />
            </button>
            <PlaylistItem
                key={track.id}
                playlist={playlist}
                track={track}
                surroundingTracks={surroundingTracks}
                columns={["artists", "album", "tempo", "key"]}
            />
        </div>
    )
}
