import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useCustomersPaged } from "../../hooks/useQueries";

const SORT_FIELDS = [
  { label: "Name",   value: "name" },
  { label: "City",   value: "city" },
  { label: "Status", value: "leadStatus" },
];

function SortIcon({ field, sort }) {
  if (!sort.startsWith(field)) return <ChevronsUpDown size={13} className="text-[#86868b]" />;
  return sort.endsWith("asc")
    ? <ChevronUp size={13} className="text-[#0071e3]" />
    : <ChevronDown size={13} className="text-[#0071e3]" />;
}

const headers = [
  { label: "Name",   sortable: true,  field: "name" },
  { label: "Phone",  sortable: false },
  { label: "Email",  sortable: false },
  { label: "City",   sortable: true,  field: "city" },
  { label: "Source", sortable: false },
  { label: "Model",  sortable: false },
  { label: "Status", sortable: true,  field: "leadStatus" },
];

export default function Customers() {
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort]             = useState("");
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  const { data, isLoading: loading } = useCustomersPaged(page, size, debouncedSearch, sort);
  const customers = data?.content ?? [];

  useEffect(() => { if (data?.totalPages !== undefined) setTotalPages(data.totalPages); }, [data?.totalPages, setTotalPages]);

  const toggleSort = (field) => {
    if (sort === `${field},asc`)       { setSort(`${field},desc`); setPage(0); }
    else if (sort === `${field},desc`) { setSort(""); setPage(0); }
    else                               { setSort(`${field},asc`); setPage(0); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="apple-title">Customers</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input type="text" placeholder="Search customers…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                  bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                  placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] w-52 transition-all"
              />
            </div>
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

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="apple-table-header">
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
                {customers.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 text-[#86868b] text-sm">
                    {debouncedSearch ? `No customers found for "${debouncedSearch}"` : "No customers found"}
                  </td></tr>
                ) : customers.map(c => (
                  <tr key={c.customerId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{c.name}</td>
                    <td className="apple-table-cell text-[#86868b]">{c.phone}</td>
                    <td className="apple-table-cell text-[#86868b]">{c.email}</td>
                    <td className="apple-table-cell text-[#86868b]">{c.city}</td>
                    <td className="apple-table-cell text-[#86868b]">{c.leadSource}</td>
                    <td className="apple-table-cell text-[#86868b]">{c.interestedModel}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]">
                        {c.leadStatus}
                      </span>
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
