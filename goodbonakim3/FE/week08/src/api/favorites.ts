import { authApi } from "./auth-api";

interface Favorite {
  movieId: number;
}

export async function getFavorites(signal?: AbortSignal) {
  const { result } = await authApi.get("favorites", { signal }).json<{
    result: Favorite[];
  }>();
  return result.map(({ movieId }) => movieId);
}

export async function getFavorite(movieId: number, signal?: AbortSignal) {
  const { result } = await authApi.get(`favorites/${movieId}`, { signal }).json<{
    result: boolean | { isFavorite: boolean };
  }>();
  const selected = typeof result === "boolean" ? result : result?.isFavorite;
  if (typeof selected !== "boolean") {
    throw new Error("즐겨찾기 여부를 확인할 수 없어요.");
  }
  return selected;
}

export async function addFavorite(movieId: number) {
  await authApi.post("favorites", { json: { movieId } });
}

export async function deleteFavorite(movieId: number) {
  await authApi.delete(`favorites/${movieId}`);
}
