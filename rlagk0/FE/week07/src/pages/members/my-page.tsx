import { useQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { TmdbMovieDetail } from "@/api/movies/models";
import { getMovieDetail } from "@/api/movies/get-movie-detail";
import { ProfileAvatar } from "@/components/members/profile-avatar";
import MovieGrid from "@/components/movies/movie-grid";
import Pagination from "@/components/movies/pagination";
import { useBookmarkStore } from "@/stores/bookmark-store";
import { useMemberStore } from "@/stores/member-store";

const BOOKMARKS_PER_PAGE = 10;

export function MyPage() {
    const member = useMemberStore((state) => state.member);

    return (
        <main className="mx-auto w-[calc(100%-48px)] max-w-[1420px] flex-1 py-[31px] pb-[110px]">
            <div className="flex items-center justify-between border-b border-[#dfe3e9] pb-6">
                <h1 className="text-[38px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#17191f]">
                    내 정보
                </h1>

                <Link
                    className="grid h-12 place-items-center rounded-[9px] bg-[#536ce6] px-[21px] text-[15px] font-bold text-white no-underline"
                    to="/me/edit"
                >
                    정보 수정
                </Link>
            </div>

            <section className="border-b border-[#dfe3e9] py-6">
                <h2 className="text-lg font-extrabold text-[#17191f]">
                    기본 정보
                </h2>

                <div className="mt-5 flex items-center gap-8">
                    <ProfileAvatar imageUrl={member.profileImageUrl} />

                    <dl className="grid flex-1 grid-cols-2 gap-8">
                        <div>
                            <dt className="text-xs text-[#9ca2ad]">닉네임</dt>
                            <dd className="mt-1 text-base font-bold text-[#17191f]">
                                {member.nickname}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-[#9ca2ad]">이메일</dt>
                            <dd className="mt-1 text-base font-bold text-[#17191f]">
                                {member.email}
                            </dd>
                        </div>
                    </dl>
                </div>
            </section>

            <BookmarkedMovies />
        </main>
    );
}

function BookmarkedMovies() {
    const bookmarkedMovieIds = useBookmarkStore(
        (state) => state.bookmarkedMovieIds,
    );
    const [page, setPage] = useState(1);

    const totalPages = Math.max(
        1,
        Math.ceil(bookmarkedMovieIds.length / BOOKMARKS_PER_PAGE),
    );
    const currentPage = Math.min(page, totalPages);
    const pageMovieIds = bookmarkedMovieIds.slice(
        (currentPage - 1) * BOOKMARKS_PER_PAGE,
        currentPage * BOOKMARKS_PER_PAGE,
    );

    const movieQueries = useQueries({
        queries: pageMovieIds.map((movieId) => ({
            queryKey: ["movies", "detail", movieId],
            queryFn: ({ signal }: { signal: AbortSignal }) =>
                getMovieDetail(movieId, signal),
        })),
    });

    const isLoading = movieQueries.some((query) => query.isPending);
    const movies = movieQueries
        .map((query) => query.data)
        .filter((movie): movie is TmdbMovieDetail => movie !== undefined);

    return (
        <section className="py-6">
            <h2 className="mb-5 text-lg font-extrabold text-[#17191f]">
                내 즐겨찾기
            </h2>

            {bookmarkedMovieIds.length === 0 ? (
                <p className="py-16 text-center text-[#727887]">
                    아직 즐겨찾기한 영화가 없어요.
                </p>
            ) : isLoading ? (
                <p className="py-16 text-center text-[#727887]">
                    즐겨찾기 목록을 불러오는 중이에요.
                </p>
            ) : (
                <>
                    <MovieGrid movies={movies} />

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </section>
    );
}
