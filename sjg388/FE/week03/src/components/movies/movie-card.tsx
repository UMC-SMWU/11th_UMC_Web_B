import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

function MovieCard(props: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(props.movie.id) }}
        >
          <img
            className="block aspect-[20/23] w-full rounded-lg object-cover"
            src={props.movie.posterPath}
            alt={props.movie.title}
          />
        </Link>

        <button
          className={cn(
            "absolute right-2 top-2 flex cursor-pointer items-center justify-center rounded-md border-0",
            props.movie.isBookmarked
              ? "bg-[#7452f9]"
              : "bg-black/65",
          )}
          aria-pressed={props.movie.isBookmarked}
          onClick={() => props.onToggleBookmark(props.movie.id)}
        >
          <img
            className="h-5 w-5 brightness-0 invert"
            src={
              props.movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt="북마크"
          />
        </button>
      </div>

      <Link
        className="text-[#232323] no-underline"
        to="/movies/$movieId"
        params={{ movieId: String(props.movie.id) }}
      >
        <h2 className="mb-1 mt-2.5 text-sm">
          {props.movie.title}
        </h2>
      </Link>

      <p className="m-0 text-xs text-[#aaa]">
        {props.movie.releaseDate}
      </p>
    </article>
  );
}

export default MovieCard;