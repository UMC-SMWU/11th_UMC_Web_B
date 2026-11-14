import { isHTTPError } from "ky";

export const MOVIE_NOT_FOUND_MESSAGE = "영화를 찾을 수 없어요.";

export function getMovieDetailErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) {
    return MOVIE_NOT_FOUND_MESSAGE;
  }

  return "영화 정보를 불러오지 못했어요.";
}
