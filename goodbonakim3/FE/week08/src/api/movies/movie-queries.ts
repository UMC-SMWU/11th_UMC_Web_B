import { queryOptions } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { getMovieDetail } from "./get-movie-details";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

function retryMovieQuery(failureCount: number, error: Error) {
  return (
    !(isHTTPError(error) && error.response.status === 404) && failureCount < 3
  );
}

export const movieQueries = {
  detail: (id: number) =>
    queryOptions({
      queryKey: ["movies", "detail", id],
      queryFn: () => getMovieDetail(id),
      retry: retryMovieQuery,
    }),
  list: (page: number) =>
    queryOptions({
      queryKey: ["movies", "list", { page }],
      queryFn: () => getMovies({ page }),
      retry: retryMovieQuery,
    }),
  search: (query: string) =>
    queryOptions({
      queryKey: ["movies", "search", { query }],
      queryFn: () => searchMovies({ query }),
      enabled: query.length > 0,
      retry: retryMovieQuery,
    }),
};
