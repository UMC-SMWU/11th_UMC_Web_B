import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
    const { query = "" } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search" });

    const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let ignore = false;
        const normalizedQuery = query.trim();

        setMovies([]);
        setErrorMessage(null);

        if (!normalizedQuery) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        searchMovies({ query: normalizedQuery })
            .then((response) => {
                if (!ignore) setMovies(response.results);
            })
            .catch(() => {
                if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
            })
            .finally(() => {
                if (!ignore) setIsLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [query]);

    const normalizedQuery = query.trim();

    function handleSearch(nextQuery: string) {
        navigate({
            search: nextQuery ? { query: nextQuery } : {},
        });
    }

    function clearSearch() {
        navigate({ search: {} });
    }

    if (!normalizedQuery) {
        return (
            <main className="flex flex-1 items-start justify-center bg-[#f6f7f9] px-6 pt-36">
                <section className="w-full max-w-[620px] text-center">
                    <h1 className="text-[34px] leading-tight font-extrabold tracking-[-1.5px] text-[#17191f]">
                        어떤 영화를 찾고 있나요?
                    </h1>

                    <SearchForm
                        key={query}
                        initialQuery={query}
                        variant="hero"
                        onSearch={handleSearch}
                    />
                </section>
            </main>
        );
    }

    return (
        <main className="flex-1 bg-[#f6f7f9]">
            <div className="mx-auto w-[calc(100%-48px)] max-w-[1120px] py-7 pb-16">
                <h1 className="mb-5 text-[34px] font-extrabold tracking-[-1.5px] text-[#17191f]">
                    영화 검색
                </h1>

                <SearchForm
                    key={query}
                    initialQuery={query}
                    variant="compact"
                    onSearch={handleSearch}
                    onClear={clearSearch}
                />

                <div className="flex items-center justify-between border-b border-[#dfe3e9] py-4">
                    <h2 className="font-bold text-[#17191f]">
                        ‘{normalizedQuery}’ 검색 결과
                    </h2>

                    <p className="text-xs text-[#9ca2ad]">
                        영화 {movies.length}편 · 1페이지
                    </p>
                </div>

                {isLoading ? (
                    <p className="py-20 text-center text-[#727887]">
                        검색 결과를 불러오는 중이에요.
                    </p>
                ) : errorMessage ? (
                    <p className="py-20 text-center text-[#727887]">
                        {errorMessage}
                    </p>
                ) : movies.length === 0 ? (
                    <p className="py-20 text-center text-[#727887]">
                        검색 결과가 없어요.
                    </p>
                ) : (
                    <ul className="grid list-none grid-cols-1 gap-x-9 p-0 md:grid-cols-2">
                        {movies.map((movie) => {
                            const posterUrl = getTmdbPosterUrl(movie.poster_path);

                            return (
                                <li
                                    className="grid min-h-[205px] grid-cols-[108px_1fr] gap-4 border-b border-[#dfe3e9] py-5"
                                    key={movie.id}
                                >
                                    <Link
                                        to="/movies/$movieId"
                                        params={{ movieId: String(movie.id) }}
                                    >
                                        {posterUrl ? (
                                            <img
                                                className="h-[165px] w-[108px] rounded-lg object-cover"
                                                src={posterUrl}
                                                alt={`${movie.title} 포스터`}
                                            />
                                        ) : (
                                            <div className="grid h-[165px] w-[108px] place-items-center rounded-lg bg-[#e5e7eb] text-xs font-semibold text-[#9ca2ad]">
                                                이미지 없음
                                            </div>
                                        )}
                                    </Link>

                                    <div className="min-w-0 pt-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="truncate text-base font-bold text-[#17191f]">
                                                {movie.title}
                                            </h3>

                                            <BookmarkButton
                                                movieId={movie.id}
                                                movieTitle={movie.title}
                                            />
                                        </div>

                                        <p className="mt-2 flex gap-2 text-xs text-[#9ca2ad]">
                                            <span>{movie.original_title}</span>
                                            <span>{movie.release_date}</span>
                                        </p>

                                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#727887]">
                                            {movie.overview}
                                        </p>

                                        <Link
                                            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#536ce6] no-underline"
                                            to="/movies/$movieId"
                                            params={{ movieId: String(movie.id) }}
                                        >
                                            상세 보기
                                            <span aria-hidden="true">→</span>
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </main>
    );
}

interface SearchFormProps {
    /** URL의 query 값. 부모에서 key={query}로 넘겨 query가 바뀌면 폼을 새로 만들어요. */
    initialQuery: string;
    /** hero: 검색어가 없을 때 가운데 큰 검색창, compact: 결과 화면 상단 검색창 */
    variant: "hero" | "compact";
    onSearch: (query: string) => void;
    onClear?: () => void;
}

function SearchForm({
    initialQuery,
    variant,
    onSearch,
    onClear,
}: SearchFormProps) {
    const [searchText, setSearchText] = useState(initialQuery);

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        onSearch(searchText.trim());
    }

    if (variant === "hero") {
        return (
            <form
                className="mt-9 flex h-[58px] items-center rounded-[10px] border-2 border-[#17191f] bg-white px-4 shadow-[0_14px_28px_rgba(23,25,31,0.08)]"
                onSubmit={handleSubmit}
            >
                <img
                    className="h-5 w-5 opacity-60"
                    src="/icons/movie-icons/search.svg"
                    alt=""
                />

                <input
                    className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm text-[#17191f] outline-none placeholder:text-[#9ca2ad]"
                    aria-label="검색어"
                    placeholder="예: 스파이더맨"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                />

                <button
                    className="h-9 rounded-lg border-0 bg-[#17191f] px-5 text-sm font-bold text-white"
                    type="submit"
                >
                    검색
                </button>
            </form>
        );
    }

    return (
        <form
            className="flex h-12 items-center rounded-[9px] border border-[#dfe3e9] bg-white px-4"
            onSubmit={handleSubmit}
        >
            <img
                className="h-5 w-5 opacity-60"
                src="/icons/movie-icons/search.svg"
                alt=""
            />

            <input
                className="min-w-0 flex-1 border-0 bg-transparent px-4 text-sm font-semibold text-[#17191f] outline-none"
                aria-label="검색어"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
            />

            <button
                className="grid h-8 w-8 place-items-center border-0 bg-transparent text-2xl leading-none text-[#727887]"
                type="button"
                aria-label="검색어 지우기"
                onClick={() => {
                    setSearchText("");
                    onClear?.();
                }}
            >
                x
            </button>

            <button
                className="ml-3 h-9 rounded-lg border-0 bg-[#17191f] px-5 text-sm font-bold text-white"
                type="submit"
            >
                다시 검색
            </button>
        </form>
    );
}
