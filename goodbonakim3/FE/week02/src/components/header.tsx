import '../styles/header.css';

export default function Header() {
    return(
        <header className='header'>
            <div className='header-left'>
                <div className='header-logo'>
                    <img className='header-logo-icon' src='/icons/movie-icons/movie.svg' alt='' />
                <strong className='header-logo-text'>UMCine</strong>

                </div>
                <nav className="header-nav">
                    <a href='#'>영화</a>
                    <a href='#'>검색</a>
                    <a href='#'>내 정보</a>
                </nav>
            </div>

            <div className='header-right'>
                <button>검색</button>
                <button>로그인</button>
            </div>
        </header>
    );
}