import { queryOptions, useIsMutating, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, deleteFavorite, getFavorite, getFavorites } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";
import { getMemberId } from "../utils/get-member-id";

export function favoriteListOptions(accessToken: string | null) {
  return queryOptions({
    queryKey: ["favorites", getMemberId(accessToken), "list"],
    queryFn: ({ signal }) => getFavorites(signal),
    enabled: Boolean(accessToken),
    retry: false,
  });
}

export function useFavorite(movieId: number, detail: boolean) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const listOptions = favoriteListOptions(accessToken);
  const memberId = getMemberId(accessToken);
  const detailKey = ["favorites", memberId, "detail", movieId] as const;
  const mutationKey = ["favorite-toggle", memberId, movieId] as const;
  const list = useQuery({ ...listOptions, enabled: Boolean(accessToken) && !detail });
  const movie = useQuery({
    queryKey: detailKey,
    queryFn: ({ signal }) => getFavorite(movieId, signal),
    enabled: Boolean(accessToken) && detail,
    retry: false,
  });
  const pending = useIsMutating({ mutationKey }) > 0;
  const mutation = useMutation({
    mutationKey,
    mutationFn: (selected: boolean) =>
      selected ? deleteFavorite(movieId) : addFavorite(movieId),
    onSuccess: async (_, selected) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: listOptions.queryKey }),
      ]);
      queryClient.setQueryData(detailKey, !selected);
      queryClient.setQueryData(listOptions.queryKey, (ids) => {
        if (!ids) return undefined;
        const otherIds = ids.filter((id) => id !== movieId);
        return selected ? otherIds : [...otherIds, movieId];
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: detailKey }),
        queryClient.invalidateQueries({ queryKey: listOptions.queryKey }),
      ]);
    },
  });

  return {
    signedIn: Boolean(accessToken),
    selected: detail ? movie.data === true : list.data?.includes(movieId) === true,
    isPending: Boolean(accessToken) && (pending || (detail ? movie.isPending : list.isPending)),
    queryError: detail ? movie.isError : list.isError,
    mutation,
  };
}
