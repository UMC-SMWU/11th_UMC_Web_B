import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";

import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
    const { page = 1 } = useSearch({ from: "/" });
    const navigate = useNavigate({ from: "/" });

    const moviesQuery = useQuery({
        queryKey: ["movies", "list", { page }],
        queryFn: ({ signal }) => getMovies({ page }, signal),
        // 다음 페이지를 불러오는 동안 이전 페이지를 계속 보여줘서 깜빡임을 막음
        placeholderData: keepPreviousData,
    });

    const movies = moviesQuery.data?.results ?? [];
    const totalPages = moviesQuery.data?.total_pages ?? 1;

    function handlePageChange(nextPage: number) {
        navigate({ search: { page: nextPage } });
        window.scrollTo({ top: 0 });
    }

    return (
        <main className="mx-auto w-[calc(100%-48px)] max-w-[1420px] flex-1 py-[31px] pb-[110px]">
            <h1 className="mb-7 text-[38px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#17191f]">
                영화 목록
            </h1>

            {/* 데이터를 가져오는 중인지, 오류가 발생했는지 순서대로 확인 */}
            {moviesQuery.isPending ? (
                <p className="py-20 text-center text-[#727887]">
                    영화 목록을 불러오는 중이에요.
                </p>
            ) : moviesQuery.isError ? (
                <p className="py-20 text-center text-[#727887]">
                    영화 목록을 불러오지 못했어요.
                </p>
            ) : movies.length === 0 ? (
                <p className="py-20 text-center text-[#727887]">
                    조건에 맞는 영화가 없어요.
                </p>
            ) : (
                <>
                    <MovieGrid movies={movies} />

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </main>
    );
}