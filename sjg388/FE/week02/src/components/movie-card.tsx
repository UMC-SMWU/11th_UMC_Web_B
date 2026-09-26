import type {Movie} from "../types/movie";

interface MovieCardProps {
    movie: Movie;
    onToggleBookmark: (movieId: number) => void;
}

function MovieCard(props: MovieCardProps) {
    return (
        <article className="movie-card">
            <div className="posters">
                <img className="poster"
                src={props.movie.posterPath} 
                alt={props.movie.title}
                />
                <button className="bookmark-button" 
                aria-pressed={props.movie.isBookmarked}
                    onClick={() => props.onToggleBookmark(props.movie.id)}>
                        <img
                            src={props.movie.isBookmarked 
                                ? "/icons/bookmark.svg"
                                : "/icons/bookmark-outline.svg"
                            }
                            alt="북마크"
                            />
                    </button>
            </div>
            <h2>{props.movie.title}</h2>
            <p>{props.movie.releaseDate}</p>
        </article>
    );
}

export default MovieCard;