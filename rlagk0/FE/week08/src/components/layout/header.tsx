import { Link } from "@tanstack/react-router";
import { useMeQuery } from "@/hooks/use-me-query";
import { useAuthStore } from "@/stores/auth-store";

const headerButtonClassName =
    "grid h-12 place-items-center rounded-[9px] bg-[#536ce6] px-[21px] text-[15px] font-bold text-white no-underline";

export function Header() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const meQuery = useMeQuery();

    return (
        <header className="shrink-0 border-b border-[#e1e4e9] bg-white">
            <div className="mx-auto flex h-[100px] w-[calc(100%-48px)] max-w-[1420px] items-center">
                <Link
                    className="flex items-center gap-3 text-xl font-extrabold text-[#17191f] no-underline"
                    to="/"
                >
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] border-[3px] border-[#17191f]">
                        <img
                            src="/icons/movie-icons/movie.svg"
                            alt="UMCine Logo"
                        />
                    </span>

                    <span>UMCine</span>
                </Link>

                <nav className="ml-12 flex items-center gap-[30px] text-[15px]">
                    <Link
                        className="border-b-2 py-2 pb-0.5 font-semibold no-underline"
                        activeProps={{
                            className: "border-[#17191f] text-[#17191f]",
                        }}
                        inactiveProps={{
                            className: "border-transparent text-[#535869]",
                        }}
                        activeOptions={{ exact: true }}
                        to="/"
                    >
                        영화
                    </Link>

                    <Link
                        className="border-b-2 py-2 pb-0.5 font-semibold no-underline"
                        activeProps={{
                            className: "border-[#17191f] text-[#17191f]",
                        }}
                        inactiveProps={{
                            className: "border-transparent text-[#535869]",
                        }}
                        to="/search"
                    >
                        검색
                    </Link>

                    <Link
                        className="border-b-2 py-2 pb-0.5 font-semibold no-underline"
                        activeProps={{
                            className: "border-[#17191f] text-[#17191f]",
                        }}
                        inactiveProps={{
                            className: "border-transparent text-[#535869]",
                        }}
                        to="/me"
                    >
                        내 정보
                    </Link>
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <Link
                        className="grid h-12 w-12 place-items-center rounded-[10px] border border-[#dfe3e9] bg-white"
                        to="/search"
                        aria-label="영화 검색"
                    >
                        <img
                            className="h-[23px] w-[23px]"
                            src="/icons/movie-icons/search.svg"
                            alt=""
                        />
                    </Link>

                    {!accessToken ? (
                        <Link className={headerButtonClassName} to="/login">
                            로그인
                        </Link>
                    ) : meQuery.isLoading ? (
                        <span className="h-12 w-[110px] animate-pulse rounded-[9px] bg-gray-200" />
                    ) : (
                        <Link className={headerButtonClassName} to="/me">
                            마이페이지
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
