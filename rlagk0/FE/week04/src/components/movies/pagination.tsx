import { cn } from "../../utils/cn";

interface PaginationProps {
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    onPageChange,
}: PaginationProps) {
    return (
        <nav className="mt-12 flex justify-center gap-2" aria-label="페이지 이동">
            {[1, 2, 3, 4, 5].map((page) => (
                <button
                    key={page}
                    className={cn(
                        "h-10 w-10 rounded-lg border border-[#dfe3e9] bg-white p-0 font-semibold text-[#535869]",
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
        </nav>
    );
}
