import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex h-20 items-center gap-10 border-b border-[#e5e5e5] bg-white px-[76px]">
      <div className="flex items-center gap-2.5 text-2xl font-bold">
        <img
          className="rounded-[7px] border-2 border-black p-0.5"
          src="/icons/movie.svg"
          alt="UMCine 로고"
        />
        <span>UMCine</span>
      </div>

      <nav className="flex gap-6 text-sm">
        <Link className="text-[#232323] no-underline" to="/">
          영화
        </Link>
        <Link className="text-[#232323] no-underline" to="/search">
          검색
        </Link>
        <a className="text-[#232323] no-underline" href="#">
          내 정보
        </a>
      </nav>

      <div className="ml-auto flex gap-3">
        <Link
          to="/search"
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#dfe3e8] bg-white"
        >
          <img className="h-5 w-5" src="/icons/search.svg" alt="검색" />
        </Link>

        <button className="min-w-[72px] whitespace-nowrap rounded-[7px] bg-[#7452f9] px-[18px] font-semibold text-white">
          로그인
        </button>
      </div>
    </header>
  );
}