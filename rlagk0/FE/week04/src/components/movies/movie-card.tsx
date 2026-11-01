import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
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
                {movie.releaseDate}
            </p>
        </article>
    );
}
