import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from '../../api/movies/get-movie-detail';
import { getMovieDetailErrorMessage } from '../../utils/movies/get-movie-detail-error-message';
import { MovieImage } from '../../components/movies/movie-image';
import { getTmdbPosterUrl, getTmdbBackdropUrl } from '../../utils/movies/tmdb-image';
import { useBookmarkStore } from "../../stores/bookmark-store";
import { useQuery } from "@tanstack/react-query";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const parsedMovieId = Number(movieId);
  if (!Number.isSafeInteger(parsedMovieId) || parsedMovieId <= 0) return <main className="flex-1 p-20"><p role="alert">올바르지 않은 영화 번호예요.</p></main>;
  return <MovieDetailContent key={parsedMovieId} movieId={parsedMovieId} />;
}

function MovieDetailContent({ movieId }: { movieId: number }) {
  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: ({ signal }) => getMovieDetail(movieId, signal),
    staleTime: 30 * 1000,
  });
  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  if (movieDetailQuery.isPending) {
    return <main className="flex-1 p-20"><p role="status">영화 정보를 불러오는 중이에요.</p></main>;
  }

  if (movieDetailQuery.isError) {
    return <main className="flex-1 p-20"><p role="alert">{getMovieDetailErrorMessage(movieDetailQuery.error)}</p></main>;
  }

  const movie = movieDetailQuery.data;
  const isBookmarked = bookmarkedMovieIds.includes(movie.id);
  const movieMeta = [
    movie.release_date,
    movie.genres.map((genre) => genre.name).join(" · "),
    typeof movie.runtime === "number"
      ? `${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`
      : "상영 시간 정보가 없어요.",
  ].filter(Boolean).join(" · ");

  return (
    <main className="flex-1 bg-[#f0efef] text-[#232323]">
      <section className="relative h-[360px] overflow-hidden">
        <MovieImage
          src={getTmdbBackdropUrl(movie.backdrop_path)}
          alt=""

          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-[76px] pb-10 text-white">
          <Link
            to="/"
            className="mb-16 w-fit text-sm font-semibold text-white/90 hover:underline"
          >
            ← 영화 목록
          </Link>

          <h1 className="text-[34px] font-extrabold">
            {movie.title}
          </h1>

          <p className="mt-1 text-sm text-white/80">
            {movie.original_title}
          </p>

          <p className="mt-3 text-sm text-white/90">
            {movieMeta}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-[220px_minmax(0,1fr)] md:px-8 lg:grid-cols-[220px_minmax(0,1fr)_320px] lg:px-[76px]">
        <MovieImage
          src={getTmdbPosterUrl(movie.poster_path)}
          alt={`${movie.title} 포스터`}
          className="w-full rounded-xl object-cover shadow-md"
        />

        <div>
          {movie.tagline && (
            <h2 className="mb-3 text-[24px] font-bold">
              {movie.tagline}
            </h2>
          )}

          <p className="mb-6 leading-7 text-gray-700">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>

          <button
            type="button"
            onClick={() => toggleBookmark(movie.id)}
            className={`rounded-lg px-5 py-3 font-semibold text-white ${
              isBookmarked ? "bg-[#7452f9]" : "bg-[#232323]"
            }`}
          >
            {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
          </button>
        </div>

        <aside className="border-t border-gray-300 pt-6 md:col-span-2 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h2 className="mb-2 text-xl font-bold">내 평점</h2>

          <div className="mb-5 flex gap-2">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-xl"
                aria-label={`${score}점`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="mb-4 h-28 w-full resize-none rounded-lg border border-gray-300 bg-white p-3"
            placeholder="영화를 보고 느낀 점을 남겨보세요."
          />

          <button
            type="button"
            className="w-full rounded-lg bg-[#232323] py-3 font-semibold text-white"
          >
            평점 저장
          </button>
        </aside>
      </section>
    </main>
  );
}
