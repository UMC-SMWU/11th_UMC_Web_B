import { apiClient } from "./api-client";
import { authApi } from "./auth-api";

interface RatingInput {
  score: number;
  comment: string;
}

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
}

export function getMemberRatings(memberId: number, signal?: AbortSignal) {
  return apiClient.get(`members/${memberId}/ratings`, { signal }).json<Rating[]>();
}

export async function createRating(movieId: number, input: RatingInput) {
  await authApi.post("ratings", { json: { movieId, ...input } });
}

export async function updateRating(ratingId: number, input: RatingInput) {
  await authApi.patch(`ratings/${ratingId}`, { json: input });
}

export async function deleteRating(ratingId: number) {
  await authApi.delete(`ratings/${ratingId}`);
}
