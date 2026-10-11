import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
export function Header() {
  const pathname = useLocation({ select: (location: { pathname: string }) => location.pathname });
  const isSearch = pathname === "/search";
  return <header className="border-b border-[#e4e7ec] bg-white">
    <div className="mx-auto flex h-[90px] max-w-[1440px] items-center justify-between px-6 lg:px-20">
      <div className="flex items-center gap-6 sm:gap-10">
        <Link to="/" aria-label="UMCine 홈" className="flex items-center gap-2 text-xl font-black tracking-tight"><span className="flex size-8 items-center justify-center rounded-md border-2 border-[#17191e]"><img src="/icons/movie-icons/movie.svg" alt="" className="size-6" /></span>UMCine</Link>
        <nav aria-label="주 메뉴" className="flex gap-4 text-sm sm:gap-8">
          <Link to="/" aria-current={!isSearch ? "page" : undefined} className={cn("text-[#667085]", !isSearch && "font-bold text-[#17191e] underline underline-offset-4")}>영화</Link>
          <Link to="/search" aria-current={isSearch ? "page" : undefined} className={cn("text-[#667085]", isSearch && "font-bold text-[#17191e] underline underline-offset-4")}>검색</Link>
          <button type="button" title="이 주차에서는 내 정보 기능을 제공하지 않아요." disabled className="hidden text-[#667085] sm:block">내 정보</button>
        </nav>
      </div>
      <div className="flex gap-3"><Link to="/search" aria-label="영화 검색" className="flex size-10 items-center justify-center rounded-lg border border-[#e4e7ec]"><img src="/icons/movie-icons/search.svg" alt="" className="size-5 opacity-60" /></Link><button type="button" disabled title="이 주차에서는 로그인 기능을 제공하지 않아요." className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-bold text-white">로그인</button></div>
    </div>
  </header>;
}


