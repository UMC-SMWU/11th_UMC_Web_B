import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "./bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export default function MovieCard({ movie }: { movie: TmdbMovieListItem }) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  return (
    <article className="flex min-w-0 flex-col gap-1">
      <div className="relative mb-2 overflow-hidden rounded-[10px]">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          aria-label={movie.title + " 상세 보기"}
        >
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title + " 포스터"}
              className="h-[274px] w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-[274px] w-full items-center justify-center bg-gray-200 text-sm text-gray-600">
              이미지 없음
            </div>
          )}
        </Link>
        <div className="absolute right-2.5 top-2.5">
          <BookmarkButton movieId={movie.id} compact />
        </div>
      </div>
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="text-sm font-extrabold leading-snug hover:underline"
      >
        {movie.title}
      </Link>
      <p className="text-xs text-[#98a2b3]">{movie.release_date}</p>
    </article>
  );
}
