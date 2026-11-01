import { Link } from "@tanstack/react-router";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
    movie: TmdbMovieListItem;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const posterUrl = getTmdbPosterUrl(movie.poster_path);

    return (
        <article className="min-w-0">
            <div className="relative aspect-[270/306] w-full overflow-hidden rounded-[10px] bg-[#e5e7eb]">
                <Link
                    to="/movies/$movieId"
                    params={{ movieId: String(movie.id) }}
                    className="block h-full w-full"
                >
                    {posterUrl ? (
                        <img
                            className="h-full w-full object-cover"
                            src={posterUrl}
                            alt={`${movie.title} 포스터`}
                        />
                    ) : (
                        <div className="grid h-full w-full place-items-center text-xs font-semibold text-[#9ca2ad]">
                            이미지 없음
                        </div>
                    )}
                </Link>

                <BookmarkButton
                    className="absolute top-[11px] right-[11px]"
                    movieId={movie.id}
                    movieTitle={movie.title}
                />
            </div>

            <h2 className="mt-[9px] mb-[3px] overflow-hidden text-[15px] leading-[1.35] font-bold tracking-[-0.45px] text-ellipsis whitespace-nowrap text-[#17191f]">
                {movie.title}
            </h2>

            <p className="m-0 text-[12px] leading-[1.4] font-normal text-[#9ca2ad]">
                {movie.release_date.replaceAll("-", ".")}
            </p>
        </article>
    );
}
