import { useQuery } from "@tanstack/react-query";
import { getFavoriteStatus } from "@/api/favorites/get-favorite-status";
import { getFavorites, type Favorite } from "@/api/favorites/get-favorites";
import { useAuthStore } from "@/stores/auth-store";

export function useFavoritesQuery<TData = Favorite[]>(
    select?: (favorites: Favorite[]) => TData,
    enabled = true,
) {
    const accessToken = useAuthStore((state) => state.accessToken);

    return useQuery({
        queryKey: ["favorites", "list"],
        queryFn: getFavorites,
        select,
        enabled: Boolean(accessToken) && enabled,
    });
}

export function useFavoriteStatusQuery(movieId: number, enabled = true) {
    const accessToken = useAuthStore((state) => state.accessToken);

    return useQuery({
        queryKey: ["favorites", "status", movieId],
        queryFn: () => getFavoriteStatus(movieId),
        enabled: Boolean(accessToken) && enabled,
    });
}
