import { useNavigate } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useFavorite } from "../../hooks/use-favorites";

export function BookmarkButton({ movieId, compact = false }: { movieId: number; compact?: boolean }) {
  const navigate = useNavigate();
  const { signedIn, selected, isPending, queryError, mutation } = useFavorite(movieId, !compact);

  return (
    <div>
      <button
        type="button"
        aria-label={selected ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        aria-pressed={selected}
        disabled={isPending || (signedIn && queryError)}
        onClick={() => {
          if (!signedIn) {
            void navigate({ to: "/login" });
            return;
          }
          mutation.mutate(selected);
        }}
        className={cn(
          "flex cursor-pointer items-center justify-center rounded-lg text-sm font-bold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60",
          compact ? "size-[34px] border border-white/70" : "gap-2 px-4 py-3",
          selected ? "bg-[#2563eb]" : compact ? "bg-[#17191e]/80 hover:bg-[#17191e]" : "bg-[#2563eb] hover:bg-blue-700",
        )}
      >
        <img src={selected ? "/icons/movie-icons/bookmark.svg" : "/icons/movie-icons/bookmark-outline.svg"} alt="" className="size-5 invert" />
        {!compact && (selected ? "즐겨찾기 해제" : "즐겨찾기")}
      </button>
      {signedIn && (queryError || mutation.isError) && (
        <p role="alert" className="mt-1 text-xs text-red-700">
          {queryError ? "즐겨찾기를 불러오지 못했어요." : "즐겨찾기 변경에 실패했어요."}
        </p>
      )}
    </div>
  );
}
