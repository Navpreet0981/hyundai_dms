export default function Pagination({ page, totalPages, setPage }) {
  if (!totalPages || totalPages <= 1) return null;

  const btn = "w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed";
  const navBtn = `${btn} border border-[#e5e5ea] dark:border-[#3a3a3c] bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]`;

  // Build page number buttons with ellipsis
  const getPages = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i);
    const pages = [];
    if (page > 2)              pages.push(0, "...");
    for (let i = Math.max(0, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 3) pages.push("...", totalPages - 1);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 py-4 px-4 border-t border-[#e5e5ea] dark:border-[#2c2c2e] flex-wrap">

      {/* « First */}
      <button disabled={page === 0} onClick={() => setPage(0)} className={navBtn} title="First page">«</button>

      {/* ‹ Prev */}
      <button disabled={page === 0} onClick={() => setPage(page - 1)} className={navBtn} title="Previous page">‹</button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`e-${i}`} className="w-8 text-center text-[#86868b] text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`${btn} ${page === p
              ? "bg-[#0071e3] text-white"
              : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
            }`}
          >
            {p + 1}
          </button>
        )
      )}

      {/* › Next */}
      <button disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} className={navBtn} title="Next page">›</button>

      {/* » Last */}
      <button disabled={page === totalPages - 1} onClick={() => setPage(totalPages - 1)} className={navBtn} title="Last page">»</button>

    </div>
  );
}
