import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { movies } from "../../data/movies";
import { cn } from "../../utils/cn";
import { BookmarkButton } from "../../components/bookmark-button";
export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  return <SearchContent key={query ?? ""} query={query ?? ""} />;
}
function SearchContent({ query }: { query: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [text, setText] = useState(query);
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalized) ||
          movie.originalTitle.toLowerCase().includes(normalized),
      )
    : [];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ search: text.trim() ? { query: text.trim() } : {} });
  }
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1440px] flex-1 px-6 pb-12 lg:px-20",
        normalized ? "pt-6" : "pt-24 sm:pt-[208px]",
      )}
    >
      <div className={cn(!normalized && "mx-auto max-w-[790px]")}>
        <h1
          className={cn(
            "font-extrabold tracking-tight",
            normalized
              ? "mb-5 text-[36px]"
              : "mb-9 text-center text-[32px] sm:text-[44px]",
          )}
        >
          {normalized ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
        </h1>
        <form
          onSubmit={submit}
          className={cn(
            "flex items-center gap-4 rounded-xl bg-white px-4",
            normalized
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
            {normalized ? "다시 검색" : "검색"}
          </button>
        </form>
      </div>
      {!normalized ? (
        <p className="mt-5 text-center text-sm text-[#667085]">
          검색어를 입력해 주세요.
        </p>
      ) : (
        <>
          <div className="mt-4 flex items-center justify-between border-b border-[#e4e7ec] pb-4">
            <h2 className="font-bold">‘{query}’ 검색 결과</h2>
            <p className="text-xs text-[#98a2b3]">영화 {results.length}편</p>
          </div>
          {results.length === 0 ? (
            <p className="py-16 text-center text-[#667085]">
              검색 결과가 없어요.
            </p>
          ) : (
            <ul className="grid gap-x-10 md:grid-cols-2">
              {results.map((movie) => (
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
                      src={movie.posterPath}
                      alt={movie.title + " 포스터"}
                      className="h-[190px] w-[126px] rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-col">
                    <h3 className="text-lg font-bold">{movie.title}</h3>
                    <p className="mt-2 text-xs text-[#98a2b3]">
                      {movie.originalTitle}
                      <span className="ml-2">{movie.releaseDate}</span>
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
          )}
        </>
      )}
    </main>
  );
}
