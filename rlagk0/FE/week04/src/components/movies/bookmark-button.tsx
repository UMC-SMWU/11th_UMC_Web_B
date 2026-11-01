import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
    movieId: number;
    movieTitle: string;
    /**
     * icon: 카드/검색 결과에 쓰는 정사각형 아이콘 버튼
     * label: 상세 페이지에 쓰는 텍스트 버튼
     */
    variant?: "icon" | "label";
    className?: string;
}

export function BookmarkButton({
    movieId,
    movieTitle,
    variant = "icon",
    className,
}: BookmarkButtonProps) {
    const isBookmarked = useBookmarkStore((state) =>
        state.bookmarkedMovieIds.includes(movieId),
    );
    const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

    const bookmarkIcon = isBookmarked
        ? "/icons/movie-icons/bookmark.svg"
        : "/icons/movie-icons/bookmark-outline.svg";

    if (variant === "label") {
        return (
            <button
                className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-lg border-0 px-5 text-sm font-bold text-white",
                    isBookmarked ? "bg-[#17191f]" : "bg-[#536ce6]",
                    className,
                )}
                type="button"
                aria-pressed={isBookmarked}
                onClick={() => toggleBookmark(movieId)}
            >
                <img
                    className="h-4 w-4 brightness-0 invert"
                    src={bookmarkIcon}
                    alt=""
                />
                {isBookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            </button>
        );
    }

    return (
        <button
            className={cn(
                "grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[9px] border p-0",
                isBookmarked
                    ? "border-[#536ce6] bg-[#536ce6]"
                    : "border-white/90 bg-black/90",
                className,
            )}
            type="button"
            aria-label={`${movieTitle} ${isBookmarked ? "북마크 해제" : "북마크 추가"}`}
            aria-pressed={isBookmarked}
            onClick={() => toggleBookmark(movieId)}
        >
            <img
                className="h-[23px] w-[23px] brightness-0 invert"
                src={bookmarkIcon}
                alt=""
            />
        </button>
    );
}
