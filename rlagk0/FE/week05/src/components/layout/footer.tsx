export function Footer() {
    return (
        <footer className="shrink-0 border-t border-[#e1e4e9] bg-white">
            <div className="mx-auto flex w-[calc(100%-48px)] max-w-[1420px] items-center gap-3 py-6">
                <a
                    href="https://www.themoviedb.org/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        className="h-4"
                        src="/images/logos/tmdb-logo.svg"
                        alt="TMDB"
                    />
                </a>

                <p className="text-xs text-[#9ca2ad]">
                    This product uses the TMDB API but is not endorsed or
                    certified by TMDB.
                </p>
            </div>
        </footer>
    );
}
