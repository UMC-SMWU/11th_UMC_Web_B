export default function Header() {
	return (
		<header className="header">
			<div className="header-inner">
                <div className="logo-container">
					<span className="logo">
                        {/*로고 위치를 모르겠음*/}
						<img src="?" alt="" />
					</span>
                    <span className="logo-text">UMCine</span>
                </div>


				<nav className="navigation">
					<a className="active" href="#">영화</a>
					<a href="#">검색</a>
					<a href="#">내 정보</a>
				</nav>

				<div className="header-right">
					<button
						className="search-button"
						type="button"
						aria-label="영화 검색"
					>
						<img src="/icons/movie-icons/search.svg" alt="" />
					</button>

					<button className="login-button" type="button">
						로그인
					</button>
				</div>
			</div>
		</header>
	);
}