import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieCard from "./movie-card";

export default function MovieGrid({ movies }: { movies: TmdbMovieListItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-[18px] gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
