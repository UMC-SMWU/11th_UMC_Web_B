export default function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages < 2) return null;
  return <nav aria-label="영화 페이지" className="mt-12 flex items-center justify-center gap-5">
    <button className="rounded border px-4 py-2 disabled:opacity-40" disabled={page <= 1} onClick={() => onChange(page - 1)}>이전</button>
    <span>{page} / {Math.min(totalPages, 500)}</span>
    <button className="rounded border px-4 py-2 disabled:opacity-40" disabled={page >= Math.min(totalPages, 500)} onClick={() => onChange(page + 1)}>다음</button>
  </nav>;
}
