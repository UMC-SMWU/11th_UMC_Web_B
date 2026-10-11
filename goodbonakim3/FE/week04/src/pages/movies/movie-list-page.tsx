import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies } from "../../data/movies";
const PAGE_SIZE = 10;
export function MovieListPage() {
  const [page, setPage] = useState(1);
  return <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 pb-[52px] pt-6 lg:px-20"><h1 className="mb-5 text-[36px] font-extrabold leading-tight tracking-tight">영화 목록</h1><MovieGrid movies={movies.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)} /><Pagination page={page} totalPages={Math.max(1, Math.ceil(movies.length / PAGE_SIZE))} onChange={setPage} /></main>;
}

