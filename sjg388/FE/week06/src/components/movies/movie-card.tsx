import { MovieImage } from "./movie-image";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";

interface MovieCardProps {
  movie: TmdbMovieListItem;
}

function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  return (
    <article className="min-w-0">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <MovieImage
            className="block aspect-[20/23] w-full rounded-lg object-cover"
            src={getTmdbPosterUrl(movie.poster_path)}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-md border-0",
            isBookmarked
              ? "bg-[#7452f9]"
              : "bg-black/65",
          )}
          aria-label={`${movie.title} 북마크`}
          aria-pressed={isBookmarked}
          onClick={() => toggleBookmark(movie.id)}
        >
          <img
            className="h-5 w-5 brightness-0 invert"
            src={
              isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link
        className="text-[#232323] no-underline"
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h2 className="mb-1 mt-2.5 text-sm">
          {movie.title}
        </h2>
      </Link>

      <p className="m-0 text-xs text-[#aaa]">
        {movie.release_date}
      </p>
    </article>
  );
}

export default MovieCard;
