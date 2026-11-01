import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useState, type SubmitEvent } from "react";
import { searchMovies } from '../../api/movies/search-movies';
import { useMovieRequest } from '../../hooks/use-movie-request';
import { getMovieErrorMessage } from '../../utils/movies/get-movie-detail-error-message';
import { MovieImage } from '../../components/movies/movie-image';
import { getTmdbPosterUrl } from '../../utils/movies/tmdb-image';
import { useBookmarkStore } from "../../stores/bookmark-store";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  return <SearchContent key={query ?? ""} query={query ?? ""} />;
}

function SearchContent({ query }: { query: string }) {
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  const normalizedQuery = query.trim();
  const loader = useCallback((signal: AbortSignal) => normalizedQuery
    ? searchMovies({ query: normalizedQuery }, signal)
    : Promise.resolve({ page: 1, results: [], total_pages: 0, total_results: 0 }), [normalizedQuery]);
  const state = useMovieRequest(loader, getMovieErrorMessage);
  const searchResults = state.status === 'success' ? state.data.results : [];

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
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3"
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
        <p>검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="mb-6 flex items-end justify-between border-b border-gray-300 pb-4">
            <h2 className="text-xl font-bold">
              ‘{query}’ 검색 결과
            </h2>
            <p className="text-sm text-gray-500">
              {state.status === 'success' ? '영화 ' + state.data.total_results + '편' : ''}
            </p>
          </div>

          {state.status === 'loading' ? <p role="status">검색 결과를 불러오는 중이에요.</p> : state.status === 'error' ? <p role="alert">{state.message}</p> : searchResults.length === 0 ? (
            <p>검색 결과가 없어요.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 border-b border-gray-300 pb-6"
                >
                  <MovieImage
                    src={getTmdbPosterUrl(movie.poster_path)}
                    alt={`${movie.title} 포스터`}
                    className="h-[180px] w-[120px] flex-none rounded-lg object-cover"
                  />

                  <div className="min-w-0 flex-1 py-1">
                    <h3 className="mb-1 text-lg font-bold">
                      {movie.title}
                    </h3>
                    <p className="mb-1 text-sm text-gray-500">
                      {movie.original_title}
                    </p>
                    <p className="mb-4 text-sm text-gray-500">
                      {movie.release_date}
                    </p>
                    <p className="mb-5 line-clamp-2 text-sm leading-6 text-gray-600">
                      {movie.overview}
                    </p>

                    <Link
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                      className="text-sm font-semibold text-[#7452f9]"
                    >
                      상세 보기 →
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(movie.id)}
                      className="ml-4 text-sm font-semibold text-[#7452f9]"
                    >
                      {bookmarkedMovieIds.includes(movie.id)
                        ? "북마크 해제"
                        : "북마크 추가"}
                    </button>
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
