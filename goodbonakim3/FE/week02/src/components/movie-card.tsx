import type {Movie} from '../types/movie';
import '../styles/movie-card.css'

interface MovieCardProps {
    movie: Movie;
    onToggleBookmark: (movieId:number)=>void;
}


export default function MovieCard({movie, onToggleBookmark}:MovieCardProps) {


    return (
        <article className='movie-card'>
            <div className='poster-wrapper'>
               <img className='movie-poster' src={movie.posterPath}></img>
                <button className='bookmark-button' onClick={()=>onToggleBookmark(movie.id)}>
                    <img 
                    className='bookmark-icon'
                    src={
                        movie.isBookmarked ? 
                        '/icons/movie-icons/bookmark.svg'
                        : '/icons/movie-icons/bookmark-outline.svg'
                        }
                        alt = '북마크' />
                </button> 
            </div>
            
            <h2 className='movie-title'>{movie.title}</h2>
            <p className='movie-release-date'>{movie.releaseDate}</p>
            
        </article>
    );
}