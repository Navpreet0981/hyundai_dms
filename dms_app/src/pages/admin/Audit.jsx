import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import usePagination from "../../hooks/usePagination";
import { useAdminAudit } from "../../hooks/useQueries";
import { Search, ShieldCheck } from "lucide-react";

// Tailwind class map for action badge colors — object lookup avoids if/else chains
const ACTION_COLORS = {
  LOGIN:  "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  LOGOUT: "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]",
  CREATE: "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]",
  UPDATE: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  DELETE: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
};

// Tailwind class map for role badge colors
const ROLE_COLORS = {
  ADMIN:    "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  DEALER:   "bg-[#fff3cd] dark:bg-[#3a2e00] text-[#856404] dark:text-[#ffc107]",
  EMPLOYEE: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
};

// Formats ISO timestamp to Indian locale: "15 Jan 2026, 10:30 AM"
function formatTime(ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Audit() {
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Page size 20 — audit logs are dense, more rows per page makes sense
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 20);

  // Debounce search — waits 400ms after user stops typing before firing query
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  // Fetch paginated audit logs — admin sees all logs system-wide
  const { data, isLoading } = useAdminAudit(page, size, debouncedSearch);
  const logs = data?.content ?? [];

  // Sync total pages from query response into pagination hook
  useEffect(() => { if (data?.totalPages !== undefined) setTotalPages(data.totalPages); }, [data?.totalPages, setTotalPages]);

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <ShieldCheck size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="apple-title">Audit Log</h1>
              <p className="apple-subtitle mt-0.5">All system activity across all users</p>
            </div>
          </div>
          {/* Search filters across actorEmail, action, entity, description on backend */}
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
            <table className="w-full text-left min-w-[750px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Timestamp","User","Role","Dealer","Action","Entity","Description"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-[#86868b] text-sm">
                    {debouncedSearch ? `No logs found for "${debouncedSearch}"` : "No audit logs yet"}
                  </td></tr>
                ) : logs.map(log => (
                  <tr key={log.id} className="apple-table-row">
                    {/* formatTime converts ISO string to readable Indian locale format */}
                    <td className="apple-table-cell text-xs text-[#86868b] whitespace-nowrap">
                      {formatTime(log.timestamp)}
                    </td>
                    <td className="apple-table-cell text-sm font-medium truncate max-w-[160px]">
                      {log.actorEmail}
                    </td>
                    {/* Role badge — color from ROLE_COLORS lookup */}
                    <td className="apple-table-cell">
                      <span className={`apple-badge ${ROLE_COLORS[log.actorRole] || ""}`}>
                        {log.actorRole}
                      </span>
                    </td>
                    {/* dealerName is null for admin actions — show dash */}
                    <td className="apple-table-cell text-[#86868b] text-sm">
                      {log.dealerName || "—"}
                    </td>
                    {/* Action badge — color from ACTION_COLORS lookup */}
                    <td className="apple-table-cell">
                      <span className={`apple-badge ${ACTION_COLORS[log.action] || ""}`}>
                        {log.action}
                      </span>
                    </td>
                    {/* Entity + ID: shows "Customer #42" or just "Auth" for login/logout */}
                    <td className="apple-table-cell text-[#86868b] text-sm">
                      {log.entity}{log.entityId ? ` #${log.entityId}` : ""}
                    </td>
                    <td className="apple-table-cell text-sm text-[#1d1d1f] dark:text-[#f5f5f7] max-w-[220px] truncate">
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
