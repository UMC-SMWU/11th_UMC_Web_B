import { useState, useEffect } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { type TmdbMovieListItem } from "../../api/movies/models";
import { getMovies } from "../../api/movies/get-movies";

const PAGE_SIZE = 10;
export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();
    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <main className="p-6">영화 목록을 불러오는 중이에요.</main>;
  }

  if (errorMessage) {
    return <main className="p-6">{errorMessage}</main>;
  }

  if (movies.length === 0) {
    return <main className="p-6">조건에 맞는 영화가 없어요.</main>;
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pb-[52px] pt-6 lg:px-20">
      <h1 className="mb-5 text-[36px] font-extrabold leading-tight tracking-tight">
        영화 목록
      </h1>
      <MovieGrid
        movies={movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
      />
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(movies.length / PAGE_SIZE))}
        onChange={setPage}
      />
    </main>
  );
}
