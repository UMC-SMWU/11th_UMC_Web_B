import { Link, useRouterState } from '@tanstack/react-router';
import { cn } from '../lib/utils';
export default function Header() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  return <header className="border-b border-gray-100 px-5 py-6 md:px-20">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-1 text-xl font-black tracking-tight"><img src="/icons/movie-icons/movie.svg" alt="" className="size-8" />UMCine</Link>
        <nav className="flex gap-6 text-sm" aria-label="주 메뉴">
          <Link to="/" className={cn('py-1', pathname === '/' && 'font-bold underline underline-offset-8')}>영화</Link>
          <Link to="/search" search={{ query: '' }} className={cn('py-1', pathname === '/search' && 'font-bold underline underline-offset-8')}>검색</Link>
        <span className="py-1 text-gray-500">내 정보</span></nav>
      </div>
      <div className="flex items-center gap-3"><Link to="/search" search={{ query: '' }} className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm"><img src="/icons/movie-icons/search.svg" alt="" className="size-4" />검색</Link><button type="button" disabled title="로그인은 이번 과제 범위에 포함되지 않아요." className="rounded-md bg-blue-600 px-4 py-2 text-xs font-bold text-white">로그인</button></div>
    </div>
  </header>;
}


