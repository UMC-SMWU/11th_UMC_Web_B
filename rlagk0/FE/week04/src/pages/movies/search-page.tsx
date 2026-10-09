import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";

export function SearchPage() {
    const { query } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search" });

    const [searchText, setSearchText] = useState(query ?? "");

    useEffect(() => {
        setSearchText(query ?? "");
    }, [query]);

    const normalizedQuery =
        query?.trim().toLowerCase() ?? "";

    const searchResults = normalizedQuery
        ? movies.filter(
                (movie) =>
                    movie.title
                        .toLowerCase()
                        .includes(normalizedQuery) ||
                    movie.originalTitle
                        .toLowerCase()
                        .includes(normalizedQuery),
            )
        : [];

    function handleSubmit(
        event: SubmitEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const nextQuery = searchText.trim();

        navigate({
            search: nextQuery
                ? { query: nextQuery }
                : {},
        });
    }

    function clearSearch() {
        setSearchText("");

        navigate({
            search: {},
        });
    }

    if (!normalizedQuery) {
        return (
            <main className="flex flex-1 items-start justify-center bg-[#f6f7f9] px-6 pt-36">
                <section className="w-full max-w-[620px] text-center">
                    <h1 className="text-[34px] leading-tight font-extrabold tracking-[-1.5px] text-[#17191f]">
                        어떤 영화를 찾고 있나요?
                    </h1>

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
                            onChange={(event) =>
                                setSearchText(event.target.value)
                            }
                        />

                        <button
                            className="h-9 rounded-lg border-0 bg-[#17191f] px-5 text-sm font-bold text-white"
                            type="submit"
                        >
                            검색
                        </button>
                    </form>
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
                        onChange={(event) =>
                            setSearchText(event.target.value)
                        }
                    />

                    <button
                        className="grid h-8 w-8 place-items-center border-0 bg-transparent text-2xl leading-none text-[#727887]"
                        type="button"
                        aria-label="검색어 지우기"
                        onClick={clearSearch}
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

                <div className="flex items-center justify-between border-b border-[#dfe3e9] py-4">
                    <h2 className="font-bold text-[#17191f]">
                        ‘{query}’ 검색 결과
                    </h2>

                    <p className="text-xs text-[#9ca2ad]">
                        영화 {searchResults.length}편 · 1페이지
                    </p>
                </div>

                {searchResults.length === 0 ? (
                    <p className="py-20 text-center text-[#727887]">
                        검색 결과가 없어요.
                    </p>
                ) : (
                    <ul className="grid list-none grid-cols-1 gap-x-9 p-0 md:grid-cols-2">
                        {searchResults.map((movie) => (
                            <li
                                className="grid min-h-[205px] grid-cols-[108px_1fr] gap-4 border-b border-[#dfe3e9] py-5"
                                key={movie.id}
                            >
                                <Link
                                    to="/movies/$movieId"
                                    params={{
                                        movieId: String(movie.id),
                                    }}
                                >
                                    <img
                                        className="h-[165px] w-[108px] rounded-lg object-cover"
                                        src={movie.posterPath}
                                        alt={`${movie.title} 포스터`}
                                    />
                                </Link>

                                <div className="min-w-0 pt-1">
                                    <h3 className="truncate text-base font-bold text-[#17191f]">
                                        {movie.title}
                                    </h3>

                                    <p className="mt-2 flex gap-2 text-xs text-[#9ca2ad]">
                                        <span>{movie.originalTitle}</span>
                                        <span>{movie.releaseDate}</span>
                                    </p>

                                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#727887]">
                                        {movie.overview}
                                    </p>

                                    <Link
                                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#536ce6] no-underline"
                                        to="/movies/$movieId"
                                        params={{
                                            movieId: String(movie.id),
                                        }}
                                    >
                                        상세 보기
                                        <span aria-hidden="true">→</span>
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </main>
    );
}