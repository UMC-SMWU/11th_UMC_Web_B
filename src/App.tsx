import MovieGrid from './components/movie-grid';
import {movies} from './data/movies';
import { useState } from 'react';
import './styles/app.css'
import Header from './components/header';

export default function App() {
  const [movieList, setMovieList] = useState(movies);
  function toggleBookmark(movieId:number) {
    setMovieList(
      movieList.map((movie)=>
        movie.id === movieId ?
        {...movie,isBookmarked: !movie.isBookmarked}:movie)
    );
    
  }

  return (
    <>
    <Header />
    <main className='container'>
      <h1>영화 목록</h1>
      <MovieGrid movies={movieList}
      onToggleBookmark={toggleBookmark} />
    </main> 
    </>
     
  );
}