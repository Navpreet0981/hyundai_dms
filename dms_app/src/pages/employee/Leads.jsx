import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useNavigate } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import { useEmployeeLeadsPaged } from "../../hooks/useQueries";
import { Search } from "lucide-react";

export default function Leads() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [page, setPage]     = useState(0);
  const [search, setSearch] = useState("");
  const [input, setInput]   = useState("");

  const { data, isLoading: loading } = useEmployeeLeadsPaged(page, 10, search);
  const leads      = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const total      = data?.totalElements || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(input.trim());
    setPage(0);
  };

  const scheduleTestDrive = (customer) => navigate("/testdrives", { state: { customer } });

  const updateStatus = (id, status) => {
    api.put(`/customers/${id}/status?status=${status}`)
      .then(() => qc.invalidateQueries({ queryKey: ['employee-leads-paged'] }))
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="apple-title">Customer Leads</h1>
            <p className="apple-subtitle mt-1">{total} leads assigned to you</p>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                className="apple-input !pl-8 !py-2 !text-sm w-56"
                placeholder="Search leads…"
                value={input}
                onChange={e => setInput(e.target.value)}
              />
            </div>
            <button type="submit" className="apple-btn-primary !py-2 !text-sm">Search</button>
            {search && (
              <button type="button" onClick={() => { setSearch(""); setInput(""); setPage(0); }}
                className="apple-btn-secondary !py-2 !text-sm">Clear</button>
            )}
          </form>
        </div>

        {loading ? <SkeletonTable rows={10} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Name","Phone","City","Source","Model","Status","Actions"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 apple-subtitle">No leads found</td></tr>
                ) : leads.map(l => (
                  <tr key={l.customerId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{l.name}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.phone}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.city}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.leadSource}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.interestedModel}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]">{l.leadStatus}</span>
                    </td>
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <button className="apple-btn-primary !px-3 !py-1.5 !text-xs" onClick={() => scheduleTestDrive(l)}>
                          Schedule Test Drive
                        </button>
                        <select
                          defaultValue=""
                          onChange={e => { if (e.target.value) { updateStatus(l.customerId, e.target.value); e.target.value = ""; } }}
                          className="text-xs rounded-lg border border-[#e5e5ea] dark:border-[#3a3a3c]
                            bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                            px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
                        >
                          <option value="" disabled>Update Status…</option>
                          <option value="CONTACTED">Mark Contacted</option>
                          <option value="VISITED_SHOWROOM">Visited Showroom</option>
                          <option value="TEST_DRIVE_SCHEDULED">Test Drive Done</option>
                          <option value="BOOKED">Mark Booked</option>
                          <option value="LOST">Mark Lost</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
