import { isHTTPError } from 'ky';
import { env } from '../../config/env';
export function getMovieDetailErrorMessage(error: unknown) {
  if (isHTTPError(error) && error.response.status === 404) return '영화를 찾을 수 없어요.';
  return getMovieErrorMessage(error);
}
export function getMovieErrorMessage(error: unknown) {
  if (!env.tmdbAccessToken) return 'TMDB 토큰을 .env.local에 설정한 뒤 개발 서버를 재시작해 주세요.';
  if (isHTTPError(error) && error.response.status === 401) return 'TMDB 인증에 실패했어요. API Read Access Token을 확인해 주세요.';
  return '영화 정보를 불러오지 못했어요. 네트워크 연결을 확인해 주세요.';
}
