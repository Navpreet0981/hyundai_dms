export default function Pagination({ page, totalPages, setPage }) {
  if (!totalPages || totalPages === 0) return null;

  // Show max 5 page buttons with ellipsis logic
  const getPages = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i);
    const pages = [];
    if (page > 2) pages.push(0, "...");
    for (let i = Math.max(0, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 3) pages.push("...", totalPages - 1);
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-4 px-4 border-t border-[#e5e5ea] dark:border-[#2c2c2e]">
      <button
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[#e5e5ea] dark:border-[#3a3a3c]
          text-[#1d1d1f] dark:text-[#f5f5f7] bg-white dark:bg-[#2c2c2e]
          hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← Prev
      </button>

      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[#86868b] text-sm select-none">…</span>
        ) : (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors
              ${page === p
                ? "bg-[#0071e3] text-white"
                : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e]"
              }`}
          >
            {p + 1}
          </button>
        )
      )}

      <button
        disabled={page === totalPages - 1}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[#e5e5ea] dark:border-[#3a3a3c]
          text-[#1d1d1f] dark:text-[#f5f5f7] bg-white dark:bg-[#2c2c2e]
          hover:bg-[#f5f5f7] dark:hover:bg-[#3a3a3c]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </button>
    </div>
  );
}
