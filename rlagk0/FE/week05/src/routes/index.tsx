import { createFileRoute } from "@tanstack/react-router";
import { MovieListPage } from "../pages/movies/movie-list-page";

export const Route = createFileRoute("/")({
    // 1 이상의 정수만 받고, 그 외 값은 무시
    validateSearch: (search): { page?: number } => {
        const page = Number(search.page);
        return {
            page: Number.isInteger(page) && page > 0 ? page : undefined,
        };
    },
    component: MovieListPage,
});
