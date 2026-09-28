import type {Movie} from "./types/movie";

interface MovieCardProps {
	movie: Movie;
	onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
	movie,
	onToggleBookmark,
}: MovieCardProps) {
	const bookmarkIcon = movie.isBookmarked
		? "/icons/movie-icons/bookmark.svg"
		: "/icons/movie-icons/bookmark-outline.svg";

	const bookmarkLabel = movie.isBookmarked
		? "북마크 해제"
		: "북마크 추가";

	return (
		<article className="movie-card">
			<div className="poster-wrapper">
				<img
					className="movie-poster"
					src={movie.posterPath}
					alt={`${movie.title} 포스터`}
				/>

				<button
					className={`bookmark-button ${
						movie.isBookmarked ? "bookmarked" : ""
					}`}
					type="button"
					aria-label={`${movie.title} ${bookmarkLabel}`}
					aria-pressed={movie.isBookmarked}
					onClick={() => onToggleBookmark(movie.id)}
				>
					<img src={bookmarkIcon} alt="" />
				</button>
			</div>

			<h2 className="movie-title">{movie.title}</h2>
			<p className="release-date">{movie.releaseDate}</p>
		</article>
	);
}