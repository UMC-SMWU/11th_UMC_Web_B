import type { MemberRating } from "../members/get-member-ratings";
import { authApi } from "../auth-api";

export interface CreateRatingRequest {
    movieId: number;
    score: number;
    comment?: string;
}

interface CreateRatingResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: MemberRating;
}

export function createRating(body: CreateRatingRequest) {
    return authApi.post("ratings", { json: body }).json<CreateRatingResponse>();
}
