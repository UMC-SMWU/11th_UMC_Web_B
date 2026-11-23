
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { getMovies } from "../../api/movies/get-movies";
import { getMovieErrorMessage } from "../../utils/movies/get-movie-detail-error-message";

function MovieListResults({
  page,
  onPage,
}: {
  page: number;
  onPage: (page: number) => void;
}) {
  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: ({ signal }) => getMovies({ page }, signal),
  });

  if (moviesQuery.isPending) {
    return <p role="status">영화 목록을 불러오는 중이에요.</p>;
  }

  if (moviesQuery.isError) {
    return <p role="alert">{getMovieErrorMessage(moviesQuery.error)}</p>;
  }

  if (!moviesQuery.data.results.length) {
    return <p>조건에 맞는 영화가 없어요.</p>;
  }

  return (
    <>
      <MovieGrid movies={moviesQuery.data.results} />
      <Pagination
        page={page}
        totalPages={moviesQuery.data.total_pages}
        onChange={onPage}
      />
    </>
  );
}

export function MovieListPage() {
  const [page, setPage] = useState(1);

  return (
    <main className="flex-1 bg-[#f0efef] px-[76px] pb-[70px] pt-7 text-[#232323]">
      <h1 className="mb-7 text-[32px] font-bold">영화 목록</h1>
      <MovieListResults page={page} onPage={setPage} />
    </main>
  );
}
