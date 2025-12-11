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
import { AlbumDto, DiscDto, DiscTrackDto, TrackDto } from "@/apis/venus"
import { create } from "zustand"

// TODO this is a nasty workaround for the fact that the track model is scuffed a bit - this needs its own track model
export type PlaybackBaseTrack = Pick<
    TrackDto,
    | "id"
    | "title"
    | "duration"
    | "artists"
    | "features"
    | "remixers"
    | "artwork"
    | "musical_features"
> & {
    disc_track?:
        | (Pick<DiscTrackDto, "track_number"> & {
              disc: Pick<DiscDto, "disc_number" | "track_count"> & {
                  album: Pick<AlbumDto, "id" | "title">
              }
          })
        | null
}

export type PlaybackQueueEntry = {
    id: string
    track: PlaybackBaseTrack
    order: number
}

type QueueLists = {
    history: PlaybackQueueEntry[]
    currentTrack: PlaybackQueueEntry | null
    upNext: PlaybackQueueEntry[]
}

type QueueState = QueueLists & {
    orderCounter: number

    repeat: boolean
    shuffle: boolean

    setRepeat: (repeat: boolean) => void
    setShuffle: (shuffle: boolean) => void

    playTrack: (track: PlaybackBaseTrack) => void
    playTracks: (
        tracks: PlaybackBaseTrack[],
        startWith?: PlaybackBaseTrack | null,
        shuffled?: boolean,
    ) => void
    enqueue: (tracks: PlaybackBaseTrack[]) => void

    goToEntry: (entry: PlaybackQueueEntry) => void
    removeEntry: (entry: PlaybackQueueEntry) => void

    previous: () => void
    next: () => void

    canGoPrevious: () => boolean
    canGoNext: () => boolean
}

export const usePlaybackQueue = create<QueueState>((set, get) => ({
    orderCounter: 0,

    history: [],
    currentTrack: null,
    upNext: [],

    repeat: false,
    shuffle: false,

    setRepeat: (repeat: boolean) => set({ repeat }),
    setShuffle: (shuffle: boolean) => {
        if (shuffle) {
            set((state) => ({
                ...makeQueue(
                    shuffleArrayWithStart(
                        [
                            ...state.history,
                            state.currentTrack,
                            ...state.upNext,
                        ].filter(Boolean) as PlaybackQueueEntry[],
                        state.currentTrack,
                    ),
                    state.currentTrack,
                ),
                shuffle,
            }))
        } else {
            set((state) => ({
                ...orderQueue(state),
                shuffle,
            }))
        }
    },

    playTrack: (track) => {
        if (get().currentTrack?.track?.id === track.id) {
            return
        }

        set((state) => ({
            orderCounter: state.orderCounter + 1,
            history: state.currentTrack
                ? [...state.history, state.currentTrack]
                : state.history,
            currentTrack: {
                id: window.crypto.randomUUID(),
                track,
                order: state.orderCounter,
            },
            upNext: [],
        }))
    },
    playTracks: (tracks, startWith, shuffled) => {
        if (tracks.length === 0) {
            return
        }

        let counter = get().orderCounter

        const entries: PlaybackQueueEntry[] = tracks.map((track) => ({
            id: window.crypto.randomUUID(),
            track,
            order: counter++,
        }))
        const shouldShuffle = shuffled ?? get().shuffle

        const startEntry = entries.find(
            (entry) => entry.track.id === startWith?.id,
        )

        set({
            orderCounter: counter,
            shuffle: shouldShuffle,
            ...makeQueue(
                shouldShuffle
                    ? shuffleArrayWithStart(entries, startEntry ?? null)
                    : entries,
                entries.find((entry) => entry.track.id === startWith?.id),
            ),
        })
    },
    enqueue: (tracks) => {
        if (tracks.length === 0) {
            return
        }

        let counter = get().orderCounter

        const entries: PlaybackQueueEntry[] = tracks.map((track) => ({
            id: window.crypto.randomUUID(),
            track,
            order: counter++,
        }))

        if (!get().currentTrack && get().upNext.length === 0) {
            set({
                orderCounter: counter,
                currentTrack: entries[0],
                upNext: entries.slice(1),
            })
            return
        }

        set((state) => ({
            orderCounter: counter,
            upNext: [...state.upNext, ...entries],
        }))
    },

    goToEntry: (entry) => set((state) => repositionAtEntry(state, entry)),
    removeEntry: (entry) =>
        set((state) => ({
            history: state.history.filter((e) => e.id !== entry.id),
            upNext: state.upNext.filter((e) => e.id !== entry.id),
        })),

    previous: () => {
        if (get().history.length === 0) {
            if (!get().repeat || get().upNext.length === 0) {
                return
            }

            set((state) => ({
                history: [
                    state.currentTrack,
                    ...state.upNext.slice(0, -1),
                ].filter(Boolean) as PlaybackQueueEntry[],
                currentTrack: state.upNext.slice(-1)[0],
                upNext: [],
            }))
            return
        }

        set((state) => ({
            history: state.history.slice(0, -1),
            currentTrack: state.history.slice(-1)[0],
            upNext: state.currentTrack
                ? [state.currentTrack, ...state.upNext]
                : state.upNext,
        }))
    },
    next: () => {
        if (get().upNext.length === 0) {
            if (!get().repeat || get().history.length === 0) {
                return
            }

            if (get().shuffle) {
                set((state) => ({
                    ...shuffleUpNext({
                        history: [],
                        currentTrack: state.history[0],
                        upNext: [
                            ...state.history.slice(1),
                            state.currentTrack,
                        ].filter(Boolean) as PlaybackQueueEntry[],
                    }),
                }))
                return
            }

            set((state) => ({
                history: [],
                currentTrack: state.history[0],
                upNext: [...state.history.slice(1), state.currentTrack].filter(
                    Boolean,
                ) as PlaybackQueueEntry[],
            }))

            return
        }

        set((state) => ({
            history: state.currentTrack
                ? [...state.history, state.currentTrack]
                : state.history,
            currentTrack: state.upNext[0],
            upNext: state.upNext.slice(1),
        }))
    },

    canGoPrevious: () =>
        get().history.length > 0 ||
        (get().repeat &&
            (get().upNext.length > 0 || get().currentTrack !== null)),
    canGoNext: () =>
        get().upNext.length > 0 ||
        (get().repeat &&
            (get().upNext.length > 0 || get().currentTrack !== null)),
}))

function shuffleUpNext(lists: QueueLists): QueueLists {
    return {
        ...lists,
        upNext: shuffleArray(lists.upNext, lists.currentTrack),
    }
}

function makeQueue(
    entries: PlaybackQueueEntry[],
    cursorEntry: PlaybackQueueEntry | null | undefined,
) {
    if (entries.length === 0) {
        return {
            history: [],
            currentTrack: null,
            upNext: [],
        }
    }

    const cursorIndex = entries.indexOf(cursorEntry ?? entries[0])
    if (cursorIndex === -1) {
        return {
            history: [],
            currentTrack: entries[0],
            upNext: entries.slice(1),
        }
    }

    return {
        history: entries.slice(0, cursorIndex),
        currentTrack: entries[cursorIndex],
        upNext: entries.slice(cursorIndex + 1),
    }
}

function repositionAtEntry(lists: QueueLists, entry: PlaybackQueueEntry) {
    const allItems = [
        ...lists.history,
        lists.currentTrack,
        ...lists.upNext,
    ].filter(Boolean) as PlaybackQueueEntry[]

    const cursorIndex = allItems.indexOf(entry)
    if (cursorIndex === -1) {
        return lists
    }

    return {
        history: allItems.slice(0, cursorIndex),
        currentTrack: allItems[cursorIndex],
        upNext: allItems.slice(cursorIndex + 1),
    }
}

function orderQueue(lists: QueueLists): QueueLists {
    const allItems = (
        [...lists.history, lists.currentTrack, ...lists.upNext].filter(
            Boolean,
        ) as PlaybackQueueEntry[]
    ).sort((e1, e2) => e1.order - e2.order)

    const currentTrackIndex = allItems.indexOf(lists.currentTrack!)
    if (currentTrackIndex === -1) {
        return {
            history: [],
            currentTrack: null,
            upNext: allItems,
        }
    }

    return {
        history: allItems.slice(0, currentTrackIndex),
        currentTrack: allItems[currentTrackIndex],
        upNext: allItems.slice(currentTrackIndex + 1),
    }
}

function shuffleArrayWithStart<T>(array: T[], reference: T | null) {
    if (reference === null) {
        return shuffleArray(array, null)
    }

    const arrayWithoutReference = array.filter((x) => x !== reference)

    return [reference, ...shuffleArray(arrayWithoutReference, reference)]
}

function shuffleArray<T>(array: T[], _reference: T | null) {
    const shuffled = [...array]

    for (let i = shuffled.length - 1; i >= 0; i--) {
        const pick = Math.floor(Math.random() * (i + 1))
        if (pick === i) {
            continue
        }

        const tmp = shuffled[i]
        shuffled[i] = shuffled[pick]
        shuffled[pick] = tmp
    }

    return shuffled
}
