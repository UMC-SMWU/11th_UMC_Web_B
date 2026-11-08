import { useCallback, useState } from 'react';
import MovieGrid from '../../components/movies/movie-grid';
import Pagination from '../../components/movies/pagination';
import { getMovies } from '../../api/movies/get-movies';
import { useMovieRequest } from '../../hooks/use-movie-request';
import { getMovieErrorMessage } from '../../utils/movies/get-movie-detail-error-message';
function MovieListResults({ page, onPage }: { page: number; onPage: (page: number) => void }) {
  const loader = useCallback((signal: AbortSignal) => getMovies({ page }, signal), [page]);
  const state = useMovieRequest(loader, getMovieErrorMessage);
  if (state.status === 'loading') return <p role="status">영화 목록을 불러오는 중이에요.</p>;
  if (state.status === 'error') return <p role="alert">{state.message}</p>;
  if (!state.data.results.length) return <p>조건에 맞는 영화가 없어요.</p>;
  return <><MovieGrid movies={state.data.results} /><Pagination page={page} totalPages={state.data.total_pages} onChange={onPage} /></>;
}
export function MovieListPage() {
  const [page, setPage] = useState(1);
  return <main className="flex-1 bg-[#f0efef] px-[76px] pb-[70px] pt-7 text-[#232323]">
    <h1 className="mb-7 text-[32px] font-bold">영화 목록</h1>
    <MovieListResults key={page} page={page} onPage={setPage} />
  </main>;
}
