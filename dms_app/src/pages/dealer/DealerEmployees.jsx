import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { UserPlus, Search, ChevronUp, ChevronDown, ChevronsUpDown, AlertTriangle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { useEmployeesPaged } from "../../hooks/useQueries";

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

export default function DealerEmployees() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort]             = useState("");
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  // Reassign modal state
  const [reassignEmployee, setReassignEmployee] = useState(null);
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const [activeEmployees, setActiveEmployees]   = useState([]);
  const [reassignLoading, setReassignLoading]   = useState(false);
  const [reassignError, setReassignError]       = useState("");

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  const { data, isLoading: loading } = useEmployeesPaged(page, size, debouncedSearch, sort);
  const employees = data?.content ?? [];

  useEffect(() => { if (data?.totalPages !== undefined) setTotalPages(data.totalPages); }, [data?.totalPages, setTotalPages]);

  const toggleSort = (field) => {
    if (sort === `${field},asc`)       { setSort(`${field},desc`); setPage(0); }
    else if (sort === `${field},desc`) { setSort(""); setPage(0); }
    else                               { setSort(`${field},asc`); setPage(0); }
  };

  const openReassignModal = (employee) => {
    setReassignEmployee(employee);
    setTargetEmployeeId("");
    setReassignError("");
    api.get("/employees/paged?page=0&size=100")
      .then(res => setActiveEmployees(res.data.content.filter(e => e.employeeId !== employee.employeeId && e.status === "ACTIVE")))
      .catch(() => setActiveEmployees([]));
  };

  const closeReassignModal = () => { setReassignEmployee(null); setTargetEmployeeId(""); setReassignError(""); setActiveEmployees([]); };

  const handleReassignAndDelete = () => {
    if (!targetEmployeeId) { setReassignError("Please select an employee to reassign customers to."); return; }
    setReassignLoading(true);
    setReassignError("");
    api.put(`/employees/${reassignEmployee.employeeId}/reassign?targetEmployeeId=${targetEmployeeId}`)
      .then(() => { closeReassignModal(); qc.invalidateQueries({ queryKey: ['employees-paged'] }); })
      .catch(err => setReassignError(err.response?.data?.message || "Failed to reassign employee."))
      .finally(() => setReassignLoading(false));
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
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input type="text" placeholder="Search employees…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                  bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                  placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] w-48 transition-all"
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
            <button onClick={() => navigate("/dealer/add-employee")} className="apple-btn-primary flex items-center gap-2">
              <UserPlus size={15} /> Add Employee
            </button>
          </div>
        </div>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
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
                        <button onClick={() => openReassignModal(e)}
                          className="text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors">
                          Remove
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
      </div>

      {reassignEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-md p-6 shadow-apple-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-xl bg-red-50 dark:bg-red-900/20 shrink-0">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Remove Employee</h2>
                  <p className="text-sm text-[#86868b] mt-0.5">
                    Reassign all customers from <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{reassignEmployee.name}</span> before removing.
                  </p>
                </div>
              </div>
              <button onClick={closeReassignModal} className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">Reassign customers & bookings to</label>
                {activeEmployees.length === 0 ? (
                  <p className="text-sm text-[#86868b] bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-xl px-3 py-2.5">No other active employees available.</p>
                ) : (
                  <select value={targetEmployeeId} onChange={e => { setTargetEmployeeId(e.target.value); setReassignError(""); }}
                    className="w-full text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                      bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                      px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all">
                    <option value="">Select an employee…</option>
                    {activeEmployees.map(emp => (
                      <option key={emp.employeeId} value={emp.employeeId}>{emp.name} — {emp.role}</option>
                    ))}
                  </select>
                )}
              </div>
              {reassignError && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{reassignError}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={closeReassignModal} className="apple-btn-secondary flex-1">Cancel</button>
                <button onClick={handleReassignAndDelete} disabled={reassignLoading || !targetEmployeeId || activeEmployees.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-xl transition-colors">
                  {reassignLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Reassign & Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DealerLayout>
  );
}
