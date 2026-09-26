import { useState } from "react";
import "./App.css";

import Header from "./header";
import MovieGrid from "./movie-grid";
import Pagination from "./pagination";
import { movies as initialMovies } from "./data/movies";

export default function App() {
	const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

	function handleToggleBookmark(movieId: number) {
		setMovies((currentMovies) =>
			currentMovies.map((movie) =>
				movie.id === movieId
					? {
							...movie,
							isBookmarked: !movie.isBookmarked,
						}
					: movie,
			),
		);
	}

	return (
		<div className="app">
			<Header />

			<main className="movie-page">
				<h1>영화 목록</h1>

				<MovieGrid
					movies={movies}
					onToggleBookmark={handleToggleBookmark}
				/>

        <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        />
			</main>
		</div>
	);
}