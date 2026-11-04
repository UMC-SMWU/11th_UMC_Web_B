import { Link } from '@tanstack/react-router';
import type { Movie } from '../types/movie';
import { cn } from '../lib/utils';
interface MovieCardProps { movie: Movie; onToggleBookmark: (id: number) => void; }
export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return <article className="flex min-w-0 flex-col gap-1">
    <div className="relative mb-2 overflow-hidden rounded-[10px]">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} aria-label={`${movie.title} 상세 보기`}><img src={movie.posterPath} alt={`${movie.title} 포스터`} className="h-[274px] w-full object-cover transition-transform hover:scale-105" /></Link>
      <button type="button" onClick={() => onToggleBookmark(movie.id)} aria-label={`${movie.title} 북마크`} aria-pressed={movie.isBookmarked} className={cn('absolute right-3 top-3 flex size-[34px] cursor-pointer items-center justify-center rounded-lg border border-white/60 bg-[#17191e]/80', movie.isBookmarked && 'bg-blue-600')}><img src={`/icons/movie-icons/${movie.isBookmarked ? 'bookmark' : 'bookmark-outline'}.svg`} alt="" className="size-5 invert" /></button>
    </div>
    <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }} className="text-sm font-extrabold leading-snug hover:underline">{movie.title}</Link>
    <p className="text-xs text-gray-500">{movie.releaseDate}</p>
  </article>;
}

