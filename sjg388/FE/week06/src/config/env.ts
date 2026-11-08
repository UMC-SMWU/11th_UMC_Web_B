export const env = {
  tmdbApiBaseUrl: import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3',
  tmdbAccessToken: import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim() || '',
};
export function requireTmdbToken() {
  if (!env.tmdbAccessToken) throw new Error('TMDB 토큰을 .env.local에 설정한 뒤 개발 서버를 재시작해 주세요.');
}
