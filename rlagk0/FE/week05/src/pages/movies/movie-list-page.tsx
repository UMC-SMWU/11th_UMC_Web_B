import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

export function MovieListPage() {
    const { page = 1 } = useSearch({ from: "/" });
    const navigate = useNavigate({ from: "/" });

    const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        let ignore = false;

        async function loadMovies() {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await getMovies({ page });
                if (!ignore) {
                    setMovies(response.results);
                    setTotalPages(response.total_pages);
                }
            } catch {
                if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }

        loadMovies();

        return () => {
            ignore = true;
        };
    }, [page]);

    function handlePageChange(nextPage: number) {
        navigate({ search: { page: nextPage } });
        window.scrollTo({ top: 0 });
    }

    function renderContent() {
        if (isLoading) {
            return (
                <p className="py-20 text-center text-[#727887]">
                    영화 목록을 불러오는 중이에요.
                </p>
            );
        }

        if (errorMessage) {
            return (
                <p className="py-20 text-center text-[#727887]">
                    {errorMessage}
                </p>
            );
        }

        if (movies.length === 0) {
            return (
                <p className="py-20 text-center text-[#727887]">
                    조건에 맞는 영화가 없어요.
                </p>
            );
        }

        return (
            <>
                <MovieGrid movies={movies} />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </>
        );
    }

    return (
        <main className="mx-auto w-[calc(100%-48px)] max-w-[1420px] flex-1 py-[31px] pb-[110px]">
            <h1 className="mb-7 text-[38px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#17191f]">
                영화 목록
            </h1>

            {renderContent()}
        </main>
    );
}
