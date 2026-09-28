interface PaginationProps {
	currentPage: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	onPageChange,
}: PaginationProps) {
	return (
		<div className="pagination">
			{[1, 2, 3, 4, 5].map((page) => (
				<button
					key={page}
					className={
						currentPage === page
							? "page-button active"
							: "page-button"
					}
					type="button"
					onClick={() => onPageChange(page)}
				>
					{page}
				</button>
			))}
		</div>
	);
}