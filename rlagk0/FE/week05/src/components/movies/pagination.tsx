import { cn } from "../../utils/cn";

const MAX_PAGE = 500;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const lastPage = Math.min(totalPages, MAX_PAGE);

    // 현재 페이지를 가운데에 두고 최대 5개 번호 표시
    const startPage = Math.max(1, Math.min(currentPage - 2, lastPage - 4));
    const endPage = Math.min(lastPage, startPage + 4);
    const pages = [];
    for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
    }

    const buttonClassName =
        "h-10 min-w-10 rounded-lg border border-[#dfe3e9] bg-white px-2 font-semibold text-[#535869] disabled:cursor-not-allowed disabled:opacity-40";

    return (
        <nav className="mt-12 flex justify-center gap-2" aria-label="페이지 이동">
            <button
                className={buttonClassName}
                type="button"
                aria-label="이전 페이지"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ‹
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    className={cn(
                        buttonClassName,
                        currentPage === page &&
                            "border-[#536ce6] bg-[#536ce6] text-white",
                    )}
                    type="button"
                    aria-current={currentPage === page ? "page" : undefined}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}

            <button
                className={buttonClassName}
                type="button"
                aria-label="다음 페이지"
                disabled={currentPage >= lastPage}
                onClick={() => onPageChange(currentPage + 1)}
            >
                ›
            </button>
        </nav>
    );
}
