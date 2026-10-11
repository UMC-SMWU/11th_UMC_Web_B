import { Link, useParams } from "@tanstack/react-router";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });

  const movie = movies.find(
    (item) => item.id === Number(movieId),
  );

  const bookmarkedMovieIds = useBookmarkStore(
    (state) => state.bookmarkedMovieIds,
  );

  const toggleBookmark = useBookmarkStore(
    (state) => state.toggleBookmark,
  );

  if (!movie) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f0efef]">
        <p className="text-xl font-semibold text-[#232323]">
          영화를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  const isBookmarked = bookmarkedMovieIds.includes(movie.id);

  return (
    <main className="min-h-screen bg-[#f0efef] text-[#232323]">
      <section className="relative h-[360px] overflow-hidden">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
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
            {movie.originalTitle}
          </p>

          <p className="mt-3 text-sm text-white/90">
            {movie.releaseDate}
            {" · "}
            {movie.genres.join(" · ")}
            {" · "}
            {movie.runtime}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-[220px_1fr_320px] gap-8 px-[76px] py-8">
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="w-full rounded-xl object-cover shadow-md"
        />

        <div>
          <h2 className="mb-3 text-[24px] font-bold">
            {movie.tagline}
          </h2>

          <p className="mb-6 leading-7 text-gray-700">
            {movie.overview}
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

        <aside className="border-l border-gray-300 pl-8">
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