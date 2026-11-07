import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../api/movies/search-movies";
//import { type TmdbMovieListItem } from "../../api/movies/models";
import { cn } from "../../utils/cn";
import { BookmarkButton } from "../../components/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const normalizedQuery = query?.trim() ?? "";

  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: normalizedQuery }],
    queryFn: () => searchMovies({ query: normalizedQuery }),
    enabled: normalizedQuery.length > 0,
  });

  const [text, setText] = useState(query ?? "");
  const searchResults = searchQuery.data?.results ?? [];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ search: text.trim ? { query: text.trim() } : {} });
  }

  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1440px] flex-1 px-6 pb-12 lg:px-20",
        normalizedQuery ? "pt-6" : "pt-24 sm:pt-[208px]",
      )}
    >
      <div className={cn(!normalizedQuery && "mx-auto max-w-[790px]")}>
        <h1
          className={cn(
            "font-extrabold tracking-tight",
            normalizedQuery
              ? "mb-5 text-[36px]"
              : "mb-9 text-center text-[32px] sm:text-[44px]",
          )}
        >
          {normalizedQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
        </h1>
        <form
          onSubmit={submit}
          className={cn(
            "flex items-center gap-4 rounded-xl bg-white px-4",
            normalizedQuery
              ? "h-[54px] border border-[#e4e7ec]"
              : "h-[74px] border-2 border-[#17191e] shadow-xl shadow-black/5",
          )}
        >
          <img
            src="/icons/movie-icons/search.svg"
            alt=""
            className="size-5 opacity-60"
          />
          <input
            aria-label="검색어"
            placeholder="예: 스파이더맨"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#98a2b3]"
          />
          {text && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={() => setText("")}
              className="p-1"
            >
              <img
                src="/icons/movie-icons/close.svg"
                alt=""
                className="size-5 opacity-60"
              />
            </button>
          )}
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-[#17191e] px-4 py-3 text-sm font-bold text-white"
          >
            {normalizedQuery ? "다시 검색" : "검색"}
          </button>
        </form>
      </div>

      {!normalizedQuery ? (
        <p className="mt-5 text-center text-sm text-[#667085]">
          검색어를 입력해 주세요.
        </p>
      ) : searchQuery.isLoading ? (
        <p>검색 결과를 불러오는 중이에요.</p>
      ) : searchQuery.isError ? (
        <p>{searchQuery.error.message}</p>
      ) : searchQuery.isSuccess && searchResults.length === 0 ? (
        <p>검색 결과가 없어요</p>
      ) : (
        <>
          <ul className="grid gap-x-10 md:grid-cols-2">
            {searchResults.map((movie) => (
              <li
                key={movie.id}
                className="flex gap-[18px] border-b border-[#e4e7ec] py-5"
              >
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                  className="shrink-0"
                >
                  <img
                    src={getTmdbPosterUrl(movie.poster_path) ?? undefined}
                    alt={movie.title + " 포스터"}
                    className="h-[190px] w-[126px] rounded-lg object-cover"
                  />
                </Link>
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p className="mt-2 text-xs text-[#98a2b3]">
                    {movie.original_title}
                    <span className="ml-2">{movie.release_date}</span>
                  </p>
                  <p className="mt-3 text-xs leading-6 text-[#667085]">
                    {movie.overview}
                  </p>
                  <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="mt-4 text-xs font-bold text-[#2563eb]"
                  >
                    상세 보기 →
                  </Link>
                  <div className="mt-3">
                    <BookmarkButton movieId={movie.id} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
