import type { Movie } from "../../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  onToggleBookmark: (movieId: number) => void;
}

function MovieGrid(props: MovieGridProps) {
  return (
    <section className="grid w-full grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {props.movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={props.onToggleBookmark}
        />
      ))}
    </section>
  );
}

export default MovieGrid;