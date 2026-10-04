import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";

export function MovieDetailPage() {
    const { movieId } = useParams({
        from: "/movies/$movieId",
    });

    const movie = movies.find(
        (item) => item.id === Number(movieId),
    );

    const [isBookmarked, setIsBookmarked] = useState(
        movie?.isBookmarked ?? false,
    );

    const [rating, setRating] = useState(0);

    if (!movie) {
        return (
            <main className="mx-auto w-[calc(100%-48px)] max-w-[1120px] flex-1 py-16">
                <h1 className="text-2xl font-bold text-[#17191f]">
                    영화를 찾을 수 없어요.
                </h1>

                <Link
                    className="mt-5 inline-block font-semibold text-[#536ce6]"
                    to="/"
                >
                    영화 목록으로 돌아가기
                </Link>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-[#f6f7f9]">
            <section className="relative h-[310px] overflow-hidden text-white">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src={movie.backdropPath}
                    alt=""
                    aria-hidden="true"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />

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
                            {movie.originalTitle}
                        </p>

                        <p className="mt-2 flex flex-wrap gap-2 text-sm font-semibold">
                            <span>{movie.releaseDate}</span>
                            <span>·</span>

                            <span>
                                {movie.genres.join(" · ")}
                            </span>
                            <span>·</span>

                            <span>{movie.runtime}</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid w-[calc(100%-48px)] max-w-[1120px] gap-8 py-6 md:grid-cols-[1fr_310px]">
                <div className="grid gap-6 md:grid-cols-[172px_1fr]">
                    <img
                        className="h-[246px] w-[172px] rounded-[9px] object-cover shadow-lg"
                        src={movie.posterPath}
                        alt={`${movie.title} 포스터`}
                    />

                    <div>
                        <h2 className="text-xl font-extrabold text-[#17191f]">
                            {movie.tagline}
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-[#727887]">
                            {movie.overview}
                        </p>

                        <button
                            className={cn(
                                "mt-5 inline-flex h-10 items-center gap-2 rounded-lg border-0 px-5 text-sm font-bold text-white",
                                isBookmarked
                                    ? "bg-[#17191f]"
                                    : "bg-[#536ce6]",
                            )}
                            type="button"
                            onClick={() =>
                                setIsBookmarked(
                                    (value) => !value,
                                )
                            }
                        >
                            <img
                                className="h-4 w-4 brightness-0 invert"
                                src={
                                    isBookmarked
                                        ? "/icons/movie-icons/bookmark.svg"
                                        : "/icons/movie-icons/bookmark-outline.svg"
                                }
                                alt=""
                            />

                            {isBookmarked
                                ? "즐겨찾기 해제"
                                : "즐겨찾기"}
                        </button>
                    </div>
                </div>

                <aside className="border-l border-[#dfe3e9] pl-7">
                    <h2 className="text-xl font-extrabold text-[#17191f]">
                        내 평점
                    </h2>

                    <p className="mt-1 text-xs text-[#9ca2ad]">
                        별점은 필수, 후기는 선택이에요.
                    </p>

                    <div
                        className="mt-3 flex gap-2"
                        aria-label="별점 선택"
                    >
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
                                onClick={() =>
                                    setRating(score)
                                }
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="mt-3 h-24 w-full resize-none rounded-lg border border-[#dfe3e9] bg-white p-3 text-sm outline-none focus:border-[#536ce6]"
                        placeholder="영화를 보고 느낀 점을 남겨보세요."
                    />

                    <button
                        className="mt-2 h-10 w-full rounded-lg border-0 bg-[#17191f] text-sm font-bold text-white"
                        type="button"
                    >
                        평점 저장
                    </button>
                </aside>
            </section>
        </main>
    );
}