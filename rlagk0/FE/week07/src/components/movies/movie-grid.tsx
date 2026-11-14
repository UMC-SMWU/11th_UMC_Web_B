import type { TmdbMovie } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
    movies: TmdbMovie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
    return (
        <section
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            aria-label="영화 목록"
        >
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </section>
    );
}
