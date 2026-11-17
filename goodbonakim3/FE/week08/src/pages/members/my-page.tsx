import { Link } from "@tanstack/react-router";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { movieQueries } from "../../api/movies/movie-queries";
import MovieCard from "../../components/movies/movie-card";
import { Pagination } from "../../components/movies/pagination";
import { favoriteListOptions } from "../../hooks/use-favorites";
import { useAuthStore } from "../../stores/auth-store";
import { useProfile } from "../../stores/profile-store";

const PAGE_SIZE = 5;

export function MyPage() {
  const profile = useProfile((state) => state.profile);
  const accessToken = useAuthStore((state) => state.accessToken);
  const favorites = useQuery(favoriteListOptions(accessToken));
  const ids = favorites.data ?? [];
  const [requestedPage, setPage] = useState(1);
  const totalPages = Math.ceil(ids.length / PAGE_SIZE);
  const page = Math.min(requestedPage, Math.max(1, totalPages));
  const movies = useQueries({
    queries: ids
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      .map(movieQueries.detail),
  });

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-8 lg:px-20">
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">내 정보</h1>
        {profile && (
          <Link
            to="/mypage/edit"
            className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            정보 수정
          </Link>
        )}
      </div>
      {profile ? (
        <section className="border-y border-gray-200 py-4">
          <h2 className="mb-4 font-bold">기본 정보</h2>
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            <div className="grid size-20 place-items-center overflow-hidden rounded-full bg-gray-200 text-sm text-gray-600">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt="프로필"
                  className="size-full object-cover"
                />
              ) : (
                "프로필"
              )}
            </div>
            <dl className="grid gap-4 text-sm sm:grid-cols-2 sm:gap-12">
              <div>
                <dt className="text-xs text-gray-500">닉네임</dt>
                <dd className="font-semibold">{profile.nickname}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">이메일</dt>
                <dd className="font-semibold">{profile.email}</dd>
              </div>
            </dl>
          </div>
        </section>
      ) : null}
      <section className="py-7">
        <h2 className="mb-4 font-bold">내 즐겨찾기</h2>
        {favorites.isPending && (
          <p role="status">즐겨찾기를 불러오는 중이에요.</p>
        )}
        {favorites.isError && (
          <button
            type="button"
            className="text-sm text-red-700 underline"
            onClick={() => void favorites.refetch()}
          >
            즐겨찾기를 불러오지 못했어요. 다시 시도
          </button>
        )}
        {favorites.isSuccess && !ids.length && (
          <p className="text-sm text-gray-600">즐겨찾기한 영화가 없어요.</p>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {movies.map((movie, index) => {
            const id = ids[(page - 1) * PAGE_SIZE + index];
            if (movie.data) {
              return (
                <MovieCard
                  key={id}
                  movie={{
                    ...movie.data,
                    genre_ids: movie.data.genres.map((genre) => genre.id),
                  }}
                />
              );
            }
            return (
              <p key={id} className="text-sm text-gray-600">
                {movie.isError
                  ? "영화 정보를 불러오지 못했어요."
                  : "영화 정보를 불러오는 중이에요."}
              </p>
            );
          })}
        </div>
        {totalPages > 0 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </section>
    </main>
  );
}
