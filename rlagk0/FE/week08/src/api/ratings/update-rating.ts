import type { MemberRating } from "../members/get-member-ratings";
import { authApi } from "../auth-api";

export interface UpdateRatingRequest {
    score: number;
    comment?: string;
}

interface UpdateRatingResponse {
    isSuccess: boolean;
    code: string;
    message: string;
    result: MemberRating;
}

export function updateRating({
    ratingId,
    body,
}: {
    ratingId: number;
    body: UpdateRatingRequest;
}) {
    return authApi
        .patch(`ratings/${ratingId}`, { json: body })
        .json<UpdateRatingResponse>();
}
