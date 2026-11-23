import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MemberRating } from "@/api/members/get-member-ratings";
import { createRating } from "@/api/ratings/create-rating";
import { deleteRating } from "@/api/ratings/delete-rating";
import { updateRating } from "@/api/ratings/update-rating";

export function useCreateRatingMutation(memberId: number | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRating,
        onSuccess: (response) => {
            queryClient.setQueryData<MemberRating[]>(
                ["members", memberId, "ratings"],
                (ratings) => ratings && [response.result, ...ratings],
            );
            alert("평점을 등록했어요.");
        },
        onError: () => {
            alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
        },
    });
}

export function useUpdateRatingMutation(memberId: number | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRating,
        onSuccess: (response) => {
            queryClient.setQueryData<MemberRating[]>(
                ["members", memberId, "ratings"],
                (ratings) =>
                    ratings?.map((rating) =>
                        rating.ratingId === response.result.ratingId
                            ? response.result
                            : rating,
                    ),
            );
            alert("평점을 수정했어요.");
        },
        onError: () => {
            alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
        },
    });
}

export function useDeleteRatingMutation(memberId: number | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRating,
        onSuccess: (_, ratingId) => {
            queryClient.setQueryData<MemberRating[]>(
                ["members", memberId, "ratings"],
                (ratings) =>
                    ratings?.filter((rating) => rating.ratingId !== ratingId),
            );
            alert("평점을 삭제했어요.");
        },
        onError: () => {
            alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
        },
    });
}
