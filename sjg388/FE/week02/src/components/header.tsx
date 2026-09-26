function Header() {
    return (
        <header className="header">
            <div className="brand">
                <img className="logo" src="/icons/movie.svg" alt="UMCine 로고" />
                <span>UMCine</span>
            </div>

            <nav className="nav">
                <a href="#">영화</a>
                <a href="#">검색</a>
                <a href="#">내 정보</a>
            </nav>

            <div className="header-actions">
                <button className="search-button">
                    <img src="/icons/search.svg" alt="검색" />
                </button>
                <button className="login-button">로그인</button>
            </div>
        </header>
    );
}

export default Header;