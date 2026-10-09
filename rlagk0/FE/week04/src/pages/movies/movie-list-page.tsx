import { useState } from "react";

import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

export function MovieListPage() {
	const [currentPage, setCurrentPage] = useState(1);

	return (
		<main className="mx-auto w-[calc(100%-48px)] max-w-[1420px] flex-1 py-[31px] pb-[110px]">
    		<h1 className="mb-7 text-[38px] leading-[1.2] font-extrabold tracking-[-1.8px] text-[#17191f]">
    		    영화 목록
    		</h1>

			<MovieGrid movies={initialMovies}/>

			<Pagination
				currentPage={currentPage}
				onPageChange={setCurrentPage}
			/>
		</main>
	);
}