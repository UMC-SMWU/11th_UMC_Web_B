import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRating,
  deleteRating,
  getMemberRatings,
  updateRating,
} from "../../api/ratings";
import { useAuthStore } from "../../stores/auth-store";
import { getMemberId } from "../../utils/get-member-id";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { cn } from "../../utils/cn";
import type { GetMovieDetailResponse } from "../../api/movies/get-movie-details";
import { movieQueries } from "../../api/movies/movie-queries";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;
  const movieDetailQuery = useQuery({
    ...movieQueries.detail(movieId),
    enabled: isValidMovieId,
  });

  if (!isValidMovieId) {
    return <StatusMessage message="올바르지 않은 영화 번호예요." />;
  }

  if (movieDetailQuery.isPending) {
    return <StatusMessage message="영화 상세 정보를 불러오는 중이에요." />;
  }

  if (movieDetailQuery.isError) {
    return (
      <StatusMessage
        message={getMovieDetailErrorMessage(movieDetailQuery.error)}
      />
    );
  }

  if (!movieDetailQuery.data) {
    return <StatusMessage message="영화를 찾을 수 없어요." />;
  }

  return <MovieDetailContent movie={movieDetailQuery.data} />;
}

function MovieDetailContent({ movie }: { movie: GetMovieDetailResponse }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const memberId = getMemberId(accessToken);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  const runtimeText =
    movie.runtime === null
      ? "상영 시간 정보가 없어요."
      : [
          Math.floor(movie.runtime / 60) > 0
            ? `${Math.floor(movie.runtime / 60)}시간`
            : null,
          movie.runtime % 60 > 0 || movie.runtime === 0
            ? `${movie.runtime % 60}분`
            : null,
        ]
          .filter(Boolean)
          .join(" ");

  const movieInfo = [
    movie.release_date,
    movie.genres.map((genre) => genre.name).join(" , "),
    runtimeText,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative h-[360px] overflow-hidden text-white">
        <img
          src={backdropUrl ?? undefined}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-6 py-6 lg:px-20">
          <Link
            to="/"
            className="flex w-fit items-center gap-2 text-sm font-bold"
          >
            <img
              src="/icons/movie-icons/chevron-left.svg"
              alt=""
              className="size-5 invert"
            />
            영화 목록
          </Link>

          <div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-[44px]">
              {movie.title}
            </h1>
            <p className="text-sm">{movie.original_title}</p>
            <p className="mt-2 text-sm font-bold">{movieInfo}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-6 lg:grid-cols-[1fr_360px] lg:px-20">
        <div className="flex flex-col gap-8 sm:flex-row">
          <img
            src={posterUrl ?? undefined}
            alt={movie.title + " 포스터"}
            className="h-[286px] w-[200px] shrink-0 rounded-lg object-cover shadow-xl"
          />

          <div>
            <h2 className="text-xl font-bold">{movie.tagline}</h2>
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              {movie.overview}
            </p>
            <div className="mt-4">
              <BookmarkButton movieId={movie.id} />
            </div>
          </div>
        </div>

        {memberId !== null ? (
          <ReviewPanel
            key={`${memberId}:${movie.id}`}
            movieId={movie.id}
            memberId={memberId}
          />
        ) : (
          <section
            aria-label="내 평점"
            className="lg:border-l lg:border-[#e4e7ec] lg:pl-8"
          >
            <h2 className="text-lg font-bold">내 평점</h2>
            {accessToken ? (
              <p role="status" className="mt-2 text-sm">
                회원 번호를 확인할 수 없어요.
              </p>
            ) : (
              <Link
                to="/login"
                className="mt-2 block text-sm text-blue-700 underline"
              >
                로그인하고 평점 남기기
              </Link>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

function StatusMessage({ message }: { message: string }) {
  return (
    <main
      role="status"
      className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-12 lg:px-20"
    >
      {message}
    </main>
  );
}

function ReviewPanel({
  movieId,
  memberId,
}: {
  movieId: number;
  memberId: number;
}) {
  const [draftScore, setDraftScore] = useState<number>();
  const [draftComment, setDraftComment] = useState<string>();
  const queryClient = useQueryClient();
  const queryKey = ["ratings", "member", memberId] as const;
  const ratings = useQuery({
    queryKey,
    queryFn: ({ signal }) => getMemberRatings(memberId, signal),
  });
  const existing = ratings.data?.find((rating) => rating.movieId === movieId);
  const score = draftScore ?? existing?.score ?? 0;
  const comment = draftComment ?? existing?.comment ?? "";

  const mutation = useMutation({
    mutationFn: (action: "save" | "delete") => {
      if (action === "delete" && existing)
        return deleteRating(existing.ratingId);
      const input = { score, comment: comment.trim() };
      return existing
        ? updateRating(existing.ratingId, input)
        : createRating(movieId, input);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
      setDraftScore(undefined);
      setDraftComment(undefined);
    },
  });
  const disabled = !ratings.isSuccess || mutation.isPending;

  return (
    <section
      aria-label="내 평점"
      className="lg:border-l lg:border-[#e4e7ec] lg:pl-8"
    >
      <h2 className="text-lg font-bold">내 평점</h2>
      {ratings.isPending && <p role="status">평점을 불러오는 중이에요.</p>}
      {ratings.isError && (
        <button
          type="button"
          className="text-sm text-red-700 underline"
          onClick={() => void ratings.refetch()}
        >
          평점을 불러오지 못했어요. 다시 시도
        </button>
      )}

      <div className="my-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={value + "점"}
            aria-pressed={value === score}
            disabled={disabled}
            onClick={() => {
              setDraftScore(value);
              mutation.reset();
            }}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-md border border-[#e4e7ec] bg-white text-2xl disabled:opacity-60",
              value <= score ? "text-[#2563eb]" : "text-[#667085]",
            )}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        aria-label="영화 후기"
        placeholder="영화를 보고 느낀 점을 남겨보세요."
        value={comment}
        maxLength={500}
        disabled={disabled}
        onChange={(event) => {
          setDraftComment(event.target.value);
          mutation.reset();
        }}
        className="h-[102px] w-full resize-none rounded-lg border border-[#e4e7ec] bg-white p-3 text-sm placeholder:text-xs placeholder:text-[#98a2b3]"
      />

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          disabled={disabled || score === 0}
          onClick={() => mutation.mutate("save")}
          className="flex-1 rounded-md bg-[#17191e] py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {existing ? "평점 수정" : "평점 저장"}
        </button>
        {existing && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => mutation.mutate("delete")}
            className="rounded-md border border-red-300 px-4 text-sm font-bold text-red-700 disabled:opacity-50"
          >
            평점 삭제
          </button>
        )}
      </div>

      <p role="status" className="mt-2 text-xs text-[#667085]">
        {mutation.isPending && "처리 중이에요."}
        {mutation.isError && "평점을 변경하지 못했어요. 다시 시도해 주세요."}
        {mutation.isSuccess &&
          (mutation.variables === "delete"
            ? "평점을 삭제했어요."
            : "평점을 저장했어요.")}
      </p>
    </section>
  );
}
