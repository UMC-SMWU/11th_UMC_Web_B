import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movieQueries } from "../../api/movies/movie-queries";

const TMDB_MAX_PAGE = 500;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery(movieQueries.list(page));

  const movies = moviesQuery.data?.results ?? [];
  const totalPages = Math.min(
    moviesQuery.data?.total_pages ?? 0,
    TMDB_MAX_PAGE,
  );

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pb-[52px] pt-6 lg:px-20">
      <h1 className="mb-5 text-[36px] font-extrabold leading-tight tracking-tight">
        영화 목록
      </h1>

      {moviesQuery.isPending ? (
        <p>영화를 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p role="alert">영화 목록을 불러오지 못했어요. 다시 시도해 주세요.</p>
      ) : movies.length === 0 ? (
        <p>표시할 영화가 없어요.</p>
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}
