import { useState, useEffect } from "react";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import { useDealerAudit } from "../../hooks/useQueries";
import { Search, ShieldCheck } from "lucide-react";

const ACTION_COLORS = {
  LOGIN:  "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  LOGOUT: "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]",
  CREATE: "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]",
  UPDATE: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  DELETE: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

const ROLE_COLORS = {
  DEALER:   "bg-[#fff3cd] dark:bg-[#3a2e00] text-[#856404] dark:text-[#ffc107]",
  EMPLOYEE: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
};

function formatTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function DealerAudit() {
  const [search, setSearch]               = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 20);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  const { data, isLoading } = useDealerAudit(page, size, debouncedSearch);
  const logs = data?.content ?? [];

  useEffect(() => { if (data?.totalPages !== undefined) setTotalPages(data.totalPages); }, [data?.totalPages, setTotalPages]);

  return (
    <DealerLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="apple-title">Audit Log</h1>
              <p className="apple-subtitle mt-0.5">Activity by your employees and dealership</p>
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              placeholder="Search by user, action, entity…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]
                w-64 transition-all"
            />
          </div>
        </div>

        {isLoading ? <SkeletonTable rows={8} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Timestamp","User","Role","Action","Entity","Description"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-12 text-[#86868b] text-sm">
                    {debouncedSearch ? `No logs found for "${debouncedSearch}"` : "No audit logs yet"}
                  </td></tr>
                ) : logs.map(log => (
                  <tr key={log.id} className="apple-table-row">
                    <td className="apple-table-cell text-xs text-[#86868b] whitespace-nowrap">
                      {formatTime(log.timestamp)}
                    </td>
                    <td className="apple-table-cell text-sm font-medium truncate max-w-[160px]">
                      {log.actorEmail}
                    </td>
                    <td className="apple-table-cell">
                      <span className={`apple-badge ${ROLE_COLORS[log.actorRole] || ""}`}>
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="apple-table-cell">
                      <span className={`apple-badge ${ACTION_COLORS[log.action] || ""}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="apple-table-cell text-[#86868b] text-sm">
                      {log.entity}{log.entityId ? ` #${log.entityId}` : ""}
                    </td>
                    <td className="apple-table-cell text-sm text-[#1d1d1f] dark:text-[#f5f5f7] max-w-[240px] truncate">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>
    </DealerLayout>
  );
}
