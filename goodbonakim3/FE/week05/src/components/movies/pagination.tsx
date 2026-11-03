import { cn } from "../../utils/cn";
export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  return <nav aria-label="페이지 이동" className="mt-10 flex justify-center gap-2">
    <button type="button" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onChange(page - 1)} className="flex size-9 items-center justify-center rounded-lg disabled:opacity-20"><img src="/icons/movie-icons/chevron-left.svg" alt="" className="size-5" /></button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => <button key={number} type="button" aria-current={number === page ? "page" : undefined} onClick={() => onChange(number)} className={cn("size-9 cursor-pointer rounded-lg text-sm font-bold", number === page ? "bg-[#17191e] text-white" : "text-[#667085] hover:bg-gray-200")}>{number}</button>)}
    <button type="button" aria-label="다음 페이지" disabled={page >= totalPages} onClick={() => onChange(page + 1)} className="flex size-9 items-center justify-center rounded-lg disabled:opacity-20"><img src="/icons/movie-icons/chevron-right.svg" alt="" className="size-5" /></button>
  </nav>;
}

