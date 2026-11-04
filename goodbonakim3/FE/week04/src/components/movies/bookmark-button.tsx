import { cn } from "../../utils/cn";
import { useBookmarkStore } from "../../stores/bookmark-store";
export function BookmarkButton({
  movieId,
  compact = false,
}: {
  movieId: number;
  compact?: boolean;
}) {
  const selected = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggle = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      aria-label={selected ? "북마크 해제" : "북마크 추가"}
      aria-pressed={selected}
      onClick={() => toggle(movieId)}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-lg text-sm font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        compact ? "size-[34px] border border-white/70" : "gap-2 px-4 py-3",
        selected
          ? "bg-[#2563eb]"
          : compact
            ? "bg-[#17191e]/80 hover:bg-[#17191e]"
            : "bg-[#2563eb] hover:bg-blue-700",
      )}
    >
      <img
        src={
          selected
            ? "/icons/movie-icons/bookmark.svg"
            : "/icons/movie-icons/bookmark-outline.svg"
        }
        alt=""
        className="size-5 invert"
      />
      {!compact && (selected ? "즐겨찾기 해제" : "즐겨찾기")}
    </button>
  );
}
