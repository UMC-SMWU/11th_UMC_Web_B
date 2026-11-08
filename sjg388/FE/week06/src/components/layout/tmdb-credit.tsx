export function TmdbCredit() {
  return <footer aria-label="Credits" className="border-t border-gray-300 bg-white px-[76px] py-6 text-xs text-gray-600">
    <h2 className="mb-3 font-semibold">영화 데이터 출처</h2>
    <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3">
      <img src="/tmdb-logo.svg" alt="TMDB" className="w-20" />
      <span>The Movie Database</span>
    </a>
    <p className="mt-3">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
  </footer>;
}
