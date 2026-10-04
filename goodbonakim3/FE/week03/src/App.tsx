import { createContext, useContext, useState, type FormEvent } from 'react';
import { createRootRoute, createRoute, createRouter, Link, Outlet, RouterProvider, useNavigate } from '@tanstack/react-router';
import Header from './components/header';
import MovieGrid from './components/movie-grid';
import { movies } from './data/movies';
import type { Movie } from './types/movie';
import { cn } from './lib/utils';
const MovieContext = createContext<{ list: Movie[]; toggle: (id: number) => void }>({ list: movies, toggle: () => {} });
const container = 'mx-auto w-full max-w-[1440px] px-5 md:px-20';
function Layout() {
  return <div className="flex min-h-screen flex-col bg-[#f5f6f8] font-sans text-[#17191e]"><div className="bg-white"><Header /></div><Outlet /><footer className="mt-auto border-t border-gray-200 bg-white py-5"><div className={cn(container, 'flex items-center justify-end gap-2 text-xs text-gray-500')}><img src="/images/logos/tmdb-logo.svg" alt="TMDB" className="w-6" /><p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p></div></footer></div>;
}
function Home() {
  const { list, toggle } = useContext(MovieContext);
  return <main className={cn(container, 'flex-1 py-7')}><h1 className="mb-5 text-[32px] font-extrabold tracking-tight">영화 목록</h1><MovieGrid movies={list} onToggleBookmark={toggle} /><nav aria-label="페이지" className="mt-10 flex justify-center"><span aria-current="page" className="rounded-md bg-[#17191e] px-4 py-2 text-sm text-white">1</span></nav></main>;
}
function Search() {
  const { query } = searchRoute.useSearch();
  const navigate = useNavigate();
  const { list } = useContext(MovieContext);
  const results = list.filter(movie => `${movie.title} ${movie.originalTitle}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get('query') ?? '').trim();
    void navigate({ to: '/search', search: { query: value } });
  }
  return <main className={cn(container, 'flex-1 py-7', !query && 'pt-40')}>
    <h1 className={cn('mb-5 text-[32px] font-extrabold tracking-tight', !query && 'text-center text-[40px]')}>{query ? '영화 검색' : '어떤 영화를 찾고 있나요?'}</h1>
    <form key={query} onSubmit={submit} className={cn('flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-3', !query && 'mx-auto max-w-[790px] border-[#17191e] p-4 shadow-lg')}>
      <img src="/icons/movie-icons/search.svg" alt="" className="size-5" /><input name="query" aria-label="영화 검색어" defaultValue={query} placeholder="예: 스파이더맨" className="min-w-0 flex-1 bg-transparent text-sm outline-none" /><button type="button" aria-label="검색어 지우기" onClick={event => { const input = event.currentTarget.form?.elements.namedItem('query') as HTMLInputElement; input.value = ''; input.focus(); }} className="cursor-pointer text-gray-500">×</button><button className="cursor-pointer rounded-md bg-[#17191e] px-4 py-3 text-xs font-bold text-white">{query ? '다시 검색' : '검색'}</button>
    </form>
    {!query ? <p className="mt-5 text-center text-sm text-gray-500">검색어를 입력해 영화를 찾아보세요.</p> : <><div className="my-5 flex items-center justify-between border-b border-gray-200 pb-4"><h2 className="font-bold">‘{query}’ 검색 결과</h2><span className="text-xs text-gray-400">총 {results.length}개</span></div>{results.length ? <div className="grid gap-x-10 md:grid-cols-2">{results.map(movie => <article key={movie.id} className="flex gap-4 border-b border-gray-200 py-5"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-[190px] w-[126px] max-w-none rounded-lg object-cover" /></Link><div className="flex flex-1 flex-col gap-3"><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="font-bold hover:underline">{movie.title}</Link><p className="text-xs text-gray-400">{movie.originalTitle} · {movie.releaseDate}</p><p className="text-sm leading-relaxed text-gray-500">{movie.overview}</p><Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="mt-auto text-xs font-bold text-blue-600">상세 보기 →</Link></div></article>)}</div> : <p role="status" className="py-20 text-center text-gray-500">검색 결과가 없어요. 다른 검색어를 입력해 주세요.</p>}</>}
  </main>;
}
function Detail() {
  const { movieId } = detailRoute.useParams();
  const { list, toggle } = useContext(MovieContext);
  const movie = list.find(item => String(item.id) === movieId);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [saved, setSaved] = useState(false);
  if (!movie) return <main className={cn(container, 'flex-1 py-24 text-center')}><h1 className="text-2xl font-bold">영화를 찾을 수 없어요.</h1><Link to="/" className="mt-6 inline-block text-blue-600">영화 목록으로 돌아가기</Link></main>;
  return <main className="flex-1"><section className="relative h-[360px] bg-gray-900 text-white"><img src={movie.backdropPath} alt="" className="absolute size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" /><div className={cn(container, 'relative flex h-full flex-col justify-between py-6')}><Link to="/" className="w-fit text-xs">‹ 영화 목록</Link><div><h1 className="mb-2 text-3xl font-extrabold md:text-[40px]">{movie.title}</h1><p className="mb-2 text-sm">{movie.originalTitle}</p><p className="text-sm font-semibold">{movie.releaseDate} · {movie.genres.join(' · ')} · {movie.runtime}</p></div></div></section>
    <section className={cn(container, 'grid gap-8 py-6 md:grid-cols-[200px_1fr] lg:grid-cols-[200px_1fr_360px]')}><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="w-[200px] rounded-lg shadow-lg" /><div><h2 className="mb-4 text-xl font-bold">{movie.tagline}</h2><p className="text-sm leading-7 text-gray-500">{movie.overview}</p><button onClick={() => toggle(movie.id)} aria-pressed={movie.isBookmarked} className={cn('mt-4 flex cursor-pointer items-center gap-2 rounded-md px-4 py-3 text-xs font-bold text-white', movie.isBookmarked ? 'bg-[#17191e]' : 'bg-blue-600')}><img src="/icons/movie-icons/bookmark.svg" alt="" className="size-4 invert" />{movie.isBookmarked ? '즐겨찾기 해제' : '즐겨찾기'}</button></div>
    <form key={movieId} onSubmit={event => { event.preventDefault(); setSaved(true); }} className="border-gray-200 lg:border-l lg:pl-8"><h2 className="mb-2 text-xl font-bold">내 평점</h2><p className="mb-2 text-xs text-gray-400">별점은 필수, 후기는 선택이에요.</p><div className="mb-3 flex gap-2">{[1, 2, 3, 4, 5].map(value => <button key={value} type="button" aria-label={`${value}점`} aria-pressed={rating === value} onClick={() => { setRating(value); setSaved(false); }} className={cn('size-9 cursor-pointer rounded-md border border-gray-200 bg-white text-xl text-gray-500', value <= rating && 'text-yellow-500')}>★</button>)}</div><textarea aria-label="영화 후기" value={review} onChange={event => { setReview(event.target.value); setSaved(false); }} placeholder="영화를 보고 느낀 점을 남겨보세요." className="mb-2 h-24 w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-xs" /><button disabled={!rating} className="w-full cursor-pointer rounded-md bg-[#17191e] py-3 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">평점 저장</button>{saved && <p role="status" className="mt-2 text-xs text-blue-600">이번 화면에 평점을 저장했어요.</p>}</form></section>
  </main>;
}
const rootRoute = createRootRoute({ component: Layout, notFoundComponent: () => <p className="p-20 text-center">페이지를 찾을 수 없어요.</p> });
const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const searchRoute = createRoute({ getParentRoute: () => rootRoute, path: '/search', validateSearch: (search: Record<string, unknown>) => ({ query: typeof search.query === 'string' ? search.query : '' }), component: Search });
const detailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/movies/$movieId', component: Detail });
const router = createRouter({ routeTree: rootRoute.addChildren([homeRoute, searchRoute, detailRoute]) });
declare module '@tanstack/react-router' { interface Register { router: typeof router; } }
export default function App() {
  const [list, setList] = useState(movies);
  function toggle(id: number) { setList(previous => previous.map(movie => movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie)); }
  return <MovieContext.Provider value={{ list, toggle }}><RouterProvider router={router} /></MovieContext.Provider>;
}
