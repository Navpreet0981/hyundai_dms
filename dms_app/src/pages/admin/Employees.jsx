import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useEmployeesPaged } from "../../hooks/useQueries";

// Sortable fields available in the sort dropdown
const SORT_FIELDS = [
  { label: "Name", value: "name" },
  { label: "Role", value: "role" },
];

// Renders the correct sort direction icon based on current sort state for a given field
function SortIcon({ field, sort }) {
  if (!sort.startsWith(field)) return <ChevronsUpDown size={13} className="text-[#86868b]" />;
  return sort.endsWith("asc")
    ? <ChevronUp size={13} className="text-[#0071e3]" />
    : <ChevronDown size={13} className="text-[#0071e3]" />;
}

// Table column config — sortable:true columns get a clickable header with sort icon
const headers = [
  { label: "Name",   sortable: true,  field: "name" },
  { label: "Phone",  sortable: false },
  { label: "Email",  sortable: false },
  { label: "Dealer", sortable: false },
  { label: "City",   sortable: false },
  { label: "Role",   sortable: true,  field: "role" },
];

export default function Employees() {
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort]                       = useState(""); // format: "field,direction" e.g. "name,asc"
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  // Debounce search — fires query only after 400ms of no typing, resets to page 0
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  // Fetch paginated employees — backend scopes results by role (admin sees all)
  const { data, isLoading: loading } = useEmployeesPaged(page, size, debouncedSearch, sort);
  const employees = data?.content ?? [];

  // Sync total pages from query into pagination hook whenever data changes
  useEffect(() => { if (data?.totalPages !== undefined) setTotalPages(data.totalPages); }, [data?.totalPages, setTotalPages]);

  // Three-state sort toggle: none → asc → desc → none, resets to page 0 on change
  const toggleSort = (field) => {
    if (sort === `${field},asc`)       { setSort(`${field},desc`); setPage(0); }
    else if (sort === `${field},desc`) { setSort(""); setPage(0); }
    else                               { setSort(`${field},asc`); setPage(0); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="apple-title">Employees</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input type="text" placeholder="Search employees…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                  bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                  placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] w-52 transition-all"
              />
            </div>
            {/* Sort dropdown — passes sort string directly to backend as Spring Sort param */}
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(0); }}
              className="text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all">
              <option value="">Sort: Default</option>
              {SORT_FIELDS.map(f => (
                <>
                  <option key={`${f.value}-asc`}  value={`${f.value},asc`}>{f.label} ↑</option>
                  <option key={`${f.value}-desc`} value={`${f.value},desc`}>{f.label} ↓</option>
                </>
              ))}
            </select>
          </div>
        </div>

        {loading ? <SkeletonTable rows={6} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="apple-table-header">
                      {/* Sortable headers are buttons that call toggleSort; non-sortable are plain text */}
                      {h.sortable ? (
                        <button onClick={() => toggleSort(h.field)}
                          className="flex items-center gap-1 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">
                          {h.label}<SortIcon field={h.field} sort={sort} />
                        </button>
                      ) : h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-[#86868b] text-sm">
                    {debouncedSearch ? `No employees found for "${debouncedSearch}"` : "No employees found"}
                  </td></tr>
                ) : employees.map(e => (
                  <tr key={e.employeeId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{e.name}</td>
                    <td className="apple-table-cell text-[#86868b]">{e.phone}</td>
                    <td className="apple-table-cell text-[#86868b]">{e.email}</td>
                    {/* dealerName/dealerCity come from EmployeeDTO — show dash if unassigned */}
                    <td className="apple-table-cell text-[#86868b]">{e.dealerName || "—"}</td>
                    <td className="apple-table-cell text-[#86868b]">{e.dealerCity || "—"}</td>
                    <td className="apple-table-cell text-[#86868b]">{e.role}</td>
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
