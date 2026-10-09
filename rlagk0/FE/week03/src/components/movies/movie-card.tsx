import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

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
		<article className="min-w-0">
			<div className="relative aspect-[270/306] w-full overflow-hidden rounded-[10px] bg-[#e5e7eb]">
				<Link
					to="/movies/$movieId"
					params={{ movieId: String(movie.id) }}
					className="block h-full w-full"
				>
					<img
						className="h-full w-full object-cover"
						src={movie.posterPath}
						alt={`${movie.title} 포스터`}
					/>
				</Link>


				<button
					className={cn(
						"absolute right-[11px] top-[11px] grid h-[38px] w-[38px] place-items-center rounded-[9px] border p-0",
						movie.isBookmarked
							? "border-[#536ce6] bg-[#536ce6]"
							: "border-white/90 bg-black/90",
					)}
					type="button"
					aria-label={`${movie.title} ${bookmarkLabel}`}
					aria-pressed={movie.isBookmarked}
					onClick={() => onToggleBookmark(movie.id)}
				>
					<img
						className="h-[23px] w-[23px] brightness-0 invert"
						src={bookmarkIcon}
						alt=""
					/>
				</button>
			</div>

			<h2 className="mt-[9px] mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap text-[15px] leading-[1.35] font-bold tracking-[-0.45px] text-[#17191f]">
				{movie.title}
			</h2>

			<p className="m-0 text-[12px] leading-[1.4] font-normal text-[#9ca2ad]">
				{movie.releaseDate}
			</p>
		</article>
	);
}