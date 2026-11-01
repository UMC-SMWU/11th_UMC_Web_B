import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
    bookmarkedMovieIds: number[];
    toggleBookmark: (movieId: number) => void;
}

function isValidMovieId(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
}

export const useBookmarkStore = create<BookmarkStore>()(
    persist(
        (set) => ({
            bookmarkedMovieIds: [],
            toggleBookmark: (movieId) =>
                set((state) => ({
                    bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
                        ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
                        : [...state.bookmarkedMovieIds, movieId],
                })),
        }),
        {
            name: "umcine-bookmark-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                bookmarkedMovieIds: state.bookmarkedMovieIds,
            }),
            // localStorage 값이 손상되었거나 직접 수정된 경우에도 안전하게 복원해요.
            merge: (persistedState, currentState) => {
                const storedIds = (
                    persistedState as Partial<BookmarkStore> | undefined
                )?.bookmarkedMovieIds;

                return {
                    ...currentState,
                    bookmarkedMovieIds: Array.isArray(storedIds)
                        ? [...new Set(storedIds.filter(isValidMovieId))]
                        : [],
                };
            },
        },
    ),
);
