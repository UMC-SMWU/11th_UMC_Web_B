import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";

export function MovieListPage() {
  return (
    <main className="bg-[#f0efef] px-[76px] pb-[70px] pt-7 text-[#232323]">
      <h1 className="mb-7 text-[32px] font-bold">
        영화 목록
      </h1>

      <MovieGrid movies={movies} />

      <Pagination />
    </main>
  );
}