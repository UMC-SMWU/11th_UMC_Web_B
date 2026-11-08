import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { Fragment, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { cn } from "../../utils/cn";
import {
    getMovieDetailErrorMessage,
    MOVIE_NOT_FOUND_MESSAGE,
} from "../../utils/movies/get-movie-detail-error-message";
import {
    getTmdbBackdropUrl,
    getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

export function MovieDetailPage() {
    const { movieId: movieIdParam } = useParams({
        from: "/movies/$movieId",
    });

    const movieId = Number(movieIdParam);
    const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

    const movieDetailQuery = useQuery({
        queryKey: ["movies", "detail", movieId],
        queryFn: () => getMovieDetail(movieId),
        enabled: isValidMovieId,
        staleTime: 30 * 1000,
        retry: (failureCount, error) =>
            !(isHTTPError(error) && error.response.status === 404) &&
            failureCount < 3,
    });

    if (!isValidMovieId) {
        return <MovieDetailMessage message={MOVIE_NOT_FOUND_MESSAGE} />;
    }

    if (movieDetailQuery.isPending) {
        return <MovieDetailMessage message="영화 정보를 불러오는 중이에요." />;
    }

    if (movieDetailQuery.isError) {
        return (
            <MovieDetailMessage
                message={getMovieDetailErrorMessage(movieDetailQuery.error)}
            />
        );
    }

    const movie = movieDetailQuery.data;

    const posterUrl = getTmdbPosterUrl(movie.poster_path);
    const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

    // TMDB는 상영 시간을 모르면 null 또는 0
    const runtimeText = movie.runtime
        ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
        : "상영 시간 정보가 없어요.";

    // 한국어 정보가 없으면 빈 문자열로 오기 때문에, 값이 있는 항목만 보여줌.
    const genreText = movie.genres.map((genre) => genre.name).join(", ");
    const metaItems = [movie.release_date, genreText, runtimeText].filter(
        (item) => item !== "",
    );

    return (
        <main className="flex-1 bg-[#f6f7f9]">
            <section className="relative h-[310px] overflow-hidden bg-[#9ca2ad] text-white">
                {backdropUrl ? (
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={backdropUrl}
                        alt=""
                        aria-hidden="true"
                    />
                ) : (
                    <div
                        className="absolute inset-0 grid place-items-center text-sm font-semibold text-white/70"
                        aria-hidden="true"
                    >
                        이미지 없음
                    </div>
                )}

                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/35 to-transparent" />

                <div className="relative mx-auto flex h-full w-[calc(100%-48px)] max-w-[1120px] flex-col justify-between py-7">
                    <Link
                        className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white no-underline"
                        to="/"
                    >
                        <span aria-hidden="true">‹</span>
                        영화 목록
                    </Link>

                    <div>
                        <h1 className="text-[36px] leading-tight font-extrabold tracking-[-1.5px]">
                            {movie.title}
                        </h1>

                        <p className="mt-3 text-sm text-white/85">
                            {movie.original_title}
                        </p>

                        <p className="mt-2 flex flex-wrap gap-2 text-sm font-semibold">
                            {metaItems.map((item, index) => (
                                <Fragment key={item}>
                                    {index > 0 && <span>·</span>}
                                    <span>{item}</span>
                                </Fragment>
                            ))}
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid w-[calc(100%-48px)] max-w-[1120px] gap-8 py-6 md:grid-cols-[1fr_310px]">
                <div className="grid gap-6 md:grid-cols-[172px_1fr]">
                    {posterUrl ? (
                        <img
                            className="h-[246px] w-[172px] rounded-[9px] object-cover shadow-lg"
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                        />
                    ) : (
                        <div className="grid h-[246px] w-[172px] place-items-center rounded-[9px] bg-[#e5e7eb] text-xs font-semibold text-[#9ca2ad]">
                            이미지 없음
                        </div>
                    )}

                    <div>
                        {movie.tagline && (
                            <h2 className="mb-4 text-xl font-extrabold text-[#17191f]">
                                {movie.tagline}
                            </h2>
                        )}

                        <p className="text-sm leading-7 text-[#727887]">
                            {movie.overview || "줄거리 정보가 없어요."}
                        </p>

                        <BookmarkButton
                            className="mt-5"
                            movieId={movie.id}
                            movieTitle={movie.title}
                            variant="label"
                        />
                    </div>
                </div>

                <RatingForm key={movie.id} />
            </section>
        </main>
    );
}

function MovieDetailMessage({ message }: { message: string }) {
    return (
        <main className="mx-auto w-[calc(100%-48px)] max-w-[1120px] flex-1 py-16">
            <h1 className="text-2xl font-bold text-[#17191f]">{message}</h1>

            <Link
                className="mt-5 inline-block font-semibold text-[#536ce6]"
                to="/"
            >
                영화 목록으로 돌아가기
            </Link>
        </main>
    );
}

/**
 * 상세 → 상세로 바로 이동할 때 이전 영화의 별점이 남지 않도록 부모에서 key={movie.id}로 렌더링
 */
function RatingForm() {
    const [rating, setRating] = useState(0);

    return (
        <aside className="border-l border-[#dfe3e9] pl-7">
            <h2 className="text-xl font-extrabold text-[#17191f]">내 평점</h2>

            <p className="mt-1 text-xs text-[#9ca2ad]">
                별점은 필수, 후기는 선택이에요.
            </p>

            <div className="mt-3 flex gap-2" role="group" aria-label="별점 선택">
                {[1, 2, 3, 4, 5].map((score) => (
                    <button
                        className={cn(
                            "grid h-9 w-9 place-items-center rounded-lg border border-[#dfe3e9] bg-white text-xl",
                            score <= rating
                                ? "text-[#536ce6]"
                                : "text-[#727887]",
                        )}
                        key={score}
                        type="button"
                        aria-label={`${score}점`}
                        aria-pressed={score === rating}
                        onClick={() => setRating(score)}
                    >
                        ★
                    </button>
                ))}
            </div>

            <textarea
                className="mt-3 h-24 w-full resize-none rounded-lg border border-[#dfe3e9] bg-white p-3 text-sm outline-none focus:border-[#536ce6]"
                aria-label="후기"
                placeholder="영화를 보고 느낀 점을 남겨보세요."
            />

            <button
                className="mt-2 h-10 w-full rounded-lg border-0 bg-[#17191f] text-sm font-bold text-white"
                type="button"
            >
                평점 저장
            </button>
        </aside>
    );
}