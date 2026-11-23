import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "@/api/favorites/add-favorite";
import type { FavoriteStatus } from "@/api/favorites/get-favorite-status";
import { removeFavorite } from "@/api/favorites/remove-favorite";

interface ToggleFavoriteVariables {
    movieId: number;
    isFavorite: boolean;
}

export function useFavoriteMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ movieId, isFavorite }: ToggleFavoriteVariables) => {
            if (isFavorite) {
                await removeFavorite(movieId);
            } else {
                await addFavorite(movieId);
            }
        },
        onSuccess: (_, { movieId, isFavorite }) => {
            queryClient.setQueryData<FavoriteStatus>(
                ["favorites", "status", movieId],
                { isFavorite: !isFavorite },
            );
            queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
        },
        onError: () => {
            alert("즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.");
        },
    });
}
