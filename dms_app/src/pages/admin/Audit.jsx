import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { Search, ShieldCheck } from "lucide-react";
import { useAdminAudit } from "../../hooks/useQueries";

// Action badge color map
const ACTION_COLORS = {
  CREATE: "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]",
  UPDATE: "bg-[#dbeafe] dark:bg-[#1e3a5f] text-[#1d4ed8] dark:text-[#93c5fd]",
  DELETE: "bg-[#fee2e2] dark:bg-[#450a0a] text-[#b91c1c] dark:text-[#fca5a5]",
  LOGIN:  "bg-[#f3e8ff] dark:bg-[#3b0764] text-[#7e22ce] dark:text-[#d8b4fe]",
};

function ActionBadge({ action }) {
  const color = ACTION_COLORS[action?.toUpperCase()] ??
    "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]";
  return <span className={`apple-badge ${color}`}>{action}</span>;
}

function formatTs(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Audit() {
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 20);

  // Debounce search — resets to page 0 on new query
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  const { data, isLoading } = useAdminAudit(page, size, debouncedSearch);
  const logs = data?.content ?? [];

  useEffect(() => {
    if (data?.totalPages !== undefined) setTotalPages(data.totalPages);
  }, [data?.totalPages, setTotalPages]);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#0071e3]" />
            <h1 className="apple-title">Audit Log</h1>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text" placeholder="Search actor, action, entity…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] w-64 transition-all"
            />
          </div>
        </div>

        {isLoading ? <SkeletonTable rows={8} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Timestamp", "Actor", "Role", "Dealer", "Action", "Entity", "Description"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-[#86868b] text-sm">
                      {debouncedSearch ? `No audit logs found for "${debouncedSearch}"` : "No audit logs found"}
                    </td>
                  </tr>
                ) : logs.map(log => (
                  <tr key={log.id} className="apple-table-row">
                    <td className="apple-table-cell text-[#86868b] whitespace-nowrap">{formatTs(log.timestamp)}</td>
                    <td className="apple-table-cell font-medium">{log.actorEmail}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]">
                        {log.actorRole}
                      </span>
                    </td>
                    <td className="apple-table-cell text-[#86868b]">{log.dealerName || "—"}</td>
                    <td className="apple-table-cell"><ActionBadge action={log.action} /></td>
                    <td className="apple-table-cell text-[#86868b]">
                      {log.entity}{log.entityId ? ` #${log.entityId}` : ""}
                    </td>
                    <td className="apple-table-cell text-[#86868b] max-w-xs truncate" title={log.description}>
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
    </AdminLayout>
  );
}
