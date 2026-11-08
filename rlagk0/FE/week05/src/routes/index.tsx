import { createFileRoute } from "@tanstack/react-router";
import { MAX_PAGE } from "../components/movies/pagination";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
    // 1 ~ 500 사이의 정수만 받고, 그 외 값은 무시 (TMDB는 500페이지까지만 조회 가능)
    validateSearch: (search): { page?: number } => {
        const page = Number(search.page);
        return {
            page:
                Number.isInteger(page) && page > 0 && page <= MAX_PAGE
                    ? page
                    : undefined,
        };
    },
    component: MovieListPage,
});
