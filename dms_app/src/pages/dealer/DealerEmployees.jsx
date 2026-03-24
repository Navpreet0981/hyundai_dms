import { useEffect, useState, useCallback } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { UserPlus, UserX, Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const SORT_FIELDS = [
  { label: "Name", value: "name" },
  { label: "Role", value: "role" },
];

function SortIcon({ field, sort }) {
  if (!sort.startsWith(field)) return <ChevronsUpDown size={13} className="text-[#86868b]" />;
  return sort.endsWith("asc")
    ? <ChevronUp size={13} className="text-[#0071e3]" />
    : <ChevronDown size={13} className="text-[#0071e3]" />;
}

function buildUrl(page, size, search, sort) {
  const params = new URLSearchParams({ page, size });
  if (search.trim()) params.set("search", search.trim());
  if (sort) params.set("sort", sort);
  return `/employees/paged?${params.toString()}`;
}

export default function DealerEmployees() {
  const [employees, setEmployees]   = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort]             = useState("");
  const navigate = useNavigate();
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get(buildUrl(page, size, debouncedSearch, sort))
      .then(res => { setEmployees(res.data.content); setTotalPages(res.data.totalPages); })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [page, size, debouncedSearch, sort, setTotalPages]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleSort = (field) => {
    if (sort === `${field},asc`)       { setSort(`${field},desc`); setPage(0); }
    else if (sort === `${field},desc`) { setSort(""); setPage(0); }
    else                               { setSort(`${field},asc`); setPage(0); }
  };

  const handleDeactivate = () => {
    if (!selectedId) return;
    setActionLoading(true);
    api.delete(`/dealer/employees/${selectedId}`)
      .then(() => { setSelectedId(null); fetchData(); })
      .catch(err => console.log(err))
      .finally(() => setActionLoading(false));
  };

  const headers = [
    { label: "Name",   sortable: true,  field: "name" },
    { label: "Phone",  sortable: false },
    { label: "Email",  sortable: false },
    { label: "Role",   sortable: true,  field: "role" },
    { label: "Status", sortable: false },
    { label: "",       sortable: false },
  ];

  return (
    <DealerLayout>
      <div className="space-y-5">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="apple-title">Employees</h1>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text"
                placeholder="Search employees…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                  bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                  placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]
                  w-48 transition-all"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(0); }}
              className="text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
            >
              <option value="">Sort: Default</option>
              {SORT_FIELDS.map(f => (
                <>
                  <option key={`${f.value}-asc`}  value={`${f.value},asc`}>{f.label} ↑</option>
                  <option key={`${f.value}-desc`} value={`${f.value},desc`}>{f.label} ↓</option>
                </>
              ))}
            </select>

            <button
              onClick={() => navigate("/dealer/add-employee")}
              className="apple-btn-primary flex items-center gap-2"
            >
              <UserPlus size={15} />
              Add Employee
            </button>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="apple-table-header">
                      {h.sortable ? (
                        <button
                          onClick={() => toggleSort(h.field)}
                          className="flex items-center gap-1 hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
                        >
                          {h.label}
                          <SortIcon field={h.field} sort={sort} />
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
                    <td className="apple-table-cell text-[#86868b]">{e.role}</td>
                    <td className="apple-table-cell">
                      <span className={`apple-badge ${e.status === "ACTIVE"
                        ? "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]"
                        : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]"}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="apple-table-cell">
                      {e.status === "ACTIVE" && (
                        <button
                          onClick={() => setSelectedId(e.employeeId)}
                          className="flex items-center gap-1 text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                        >
                          <UserX size={12} /> Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}

        {/* CONFIRM MODAL */}
        {selectedId && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="apple-card p-6 w-full max-w-sm shadow-apple-lg">
              <h2 className="text-base font-semibold mb-1 text-[#1d1d1f] dark:text-[#f5f5f7]">Deactivate Employee</h2>
              <p className="text-sm text-[#86868b] mb-6">This employee will be marked as inactive and lose access.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setSelectedId(null)} className="apple-btn-secondary">Cancel</button>
                <button
                  onClick={handleDeactivate}
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  {actionLoading && <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DealerLayout>
  );
}
