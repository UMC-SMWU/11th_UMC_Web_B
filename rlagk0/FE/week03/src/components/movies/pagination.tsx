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
		<div className="mt-12 flex justify-center gap-2">
    		{[1, 2, 3, 4, 5].map((page) => (
        		<button
            		key={page}
            		className={cn(
            		    "h-10 w-10 rounded-lg border border-[#dfe3e9] bg-white p-0 font-semibold text-[#535869]",
            		    currentPage === page && "border-[#536ce6] bg-[#536ce6] text-white",
            		)}
            		type="button"
            		onClick={() => onPageChange(page)}
        		>
            		{page}
        		</button>
    		))}
		</div>
	);
}