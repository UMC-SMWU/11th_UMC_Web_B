import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";

interface MovieGridProps {
    movies: Movie[];
    onToggleBookmark: (movieId: number) => void;
}

function MovieGrid(props: MovieGridProps) {
    return (
        <section className="movie-grid">
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