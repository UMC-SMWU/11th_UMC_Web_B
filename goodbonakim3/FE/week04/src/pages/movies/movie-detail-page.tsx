import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { movies } from "../../data/movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { cn } from "../../utils/cn";
export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));
  if (!movie) return <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-12 lg:px-20">영화를 찾을 수 없어요.</main>;
  return <main className="flex flex-1 flex-col"><section className="relative h-[360px] overflow-hidden text-white"><img src={movie.backdropPath} alt="" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" /><div className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-6 py-6 lg:px-20"><Link to="/" className="flex w-fit items-center gap-2 text-sm font-bold"><img src="/icons/movie-icons/chevron-left.svg" alt="" className="size-5 invert" />영화 목록</Link><div><h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-[44px]">{movie.title}</h1><p className="text-sm">{movie.originalTitle}</p><p className="mt-2 text-sm font-bold">{movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}</p></div></div></section>
    <section className="mx-auto grid w-full max-w-[1440px] gap-8 px-6 py-6 lg:grid-cols-[1fr_360px] lg:px-20"><div className="flex flex-col gap-8 sm:flex-row"><img src={movie.posterPath} alt={movie.title + " 포스터"} className="h-[286px] w-[200px] shrink-0 rounded-lg object-cover shadow-xl" /><div><h2 className="text-xl font-bold">{movie.tagline}</h2><p className="mt-4 text-sm leading-6 text-[#667085]">{movie.overview}</p><div className="mt-4"><BookmarkButton movieId={movie.id} /></div></div></div><ReviewPanel key={movie.id} /></section>
  </main>;
}
function ReviewPanel() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  return <section aria-label="내 평점" className="lg:border-l lg:border-[#e4e7ec] lg:pl-8"><h2 className="text-lg font-bold">내 평점</h2><p className="mt-1 text-xs text-[#98a2b3]">별점을 준 후 후기를 남겨보세요.</p><div className="my-2 flex gap-1">{[1,2,3,4,5].map((value) => <button key={value} type="button" aria-label={value + "점"} aria-pressed={value === rating} onClick={() => { setRating(value); setMessage(""); }} className={cn("flex size-9 cursor-pointer items-center justify-center rounded-md border border-[#e4e7ec] bg-white text-2xl", value <= rating ? "text-[#2563eb]" : "text-[#667085]")}>★</button>)}</div><textarea aria-label="영화 후기" placeholder="영화를 보고 느낀 점을 남겨보세요." value={review} onChange={(event) => setReview(event.target.value)} className="h-[102px] w-full resize-none rounded-lg border border-[#e4e7ec] bg-white p-3 text-sm placeholder:text-xs placeholder:text-[#98a2b3]" /><button type="button" onClick={() => setMessage(rating ? "로그인 후 평점을 저장할 수 있어요." : "별점을 선택해 주세요.")} className="mt-2 w-full cursor-pointer rounded-md bg-[#17191e] py-3 text-sm font-bold text-white">평점 저장</button><p role="status" className="mt-2 text-xs text-[#667085]">{message}</p></section>;
}

