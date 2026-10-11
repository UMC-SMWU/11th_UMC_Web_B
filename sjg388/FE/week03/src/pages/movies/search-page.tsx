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

  const normalizedQuery = query?.trim().toLowerCase() ?? "";

  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextQuery = searchText.trim();

    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="min-h-screen bg-[#f0efef] px-[76px] py-8 text-[#232323]">
      <h1 className="mb-6 text-[34px] font-extrabold">
        영화 검색
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 flex w-full gap-2"
      >
        <input
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#7452f9]"
          aria-label="검색어"
          placeholder="영화 제목을 입력해 주세요."
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <button
          className="rounded-lg bg-[#232323] px-6 py-3 font-semibold text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <section className="flex min-h-[420px] items-center justify-center">
          <p className="text-lg text-gray-500">
            검색어를 입력해 주세요.
          </p>
        </section>
      ) : (
        <>
          <div className="mb-6 flex items-end justify-between border-b border-gray-300 pb-4">
            <h2 className="text-xl font-bold">
              ‘{query}’ 검색 결과
            </h2>

            <p className="text-sm text-gray-500">
              영화 {searchResults.length}편
            </p>
          </div>

          {searchResults.length === 0 ? (
            <section className="flex min-h-[360px] items-center justify-center">
              <p className="text-lg text-gray-500">
                검색 결과가 없어요.
              </p>
            </section>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 border-b border-gray-300 pb-6"
                >
                  <img
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    className="h-[180px] w-[120px] flex-none rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1 py-1">
                    <h3 className="mb-1 text-lg font-bold">
                      {movie.title}
                    </h3>

                    <p className="mb-1 text-sm text-gray-500">
                      {movie.originalTitle}
                    </p>

                    <p className="mb-4 text-sm text-gray-500">
                      {movie.releaseDate}
                    </p>

                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-gray-600">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="text-sm font-semibold text-[#7452f9] hover:underline"
                    >
                      상세 보기 →
                    </Link>
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