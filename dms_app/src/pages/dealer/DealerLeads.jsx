import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import { useDealerLeadsPaged } from "../../hooks/useQueries";
import { Search } from "lucide-react";

const btnPrimary = "px-3 py-1 text-xs bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-lg transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-lg transition-colors";
const btnDanger  = "px-3 py-1 text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors";

export default function DealerLeads() {
  const qc = useQueryClient();
  const [page, setPage]     = useState(0);
  const [search, setSearch] = useState("");
  const [input, setInput]   = useState("");

  const { data, isLoading: loading } = useDealerLeadsPaged(page, 10, search);
  const leads      = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const total      = data?.totalElements || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(input.trim());
    setPage(0);
  };

  const updateStatus = (id, status) => {
    api.put(`/customers/${id}/status?status=${status}`)
      .then(() => qc.invalidateQueries({ queryKey: ['dealer-leads-paged'] }))
      .catch(err => console.log(err));
  };

  return (
    <DealerLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="apple-title">Customer Leads</h1>
            <p className="apple-subtitle mt-0.5">{total} total leads</p>
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
            <table className="w-full text-left min-w-[700px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>{["Name","Phone","City","Model","Employee","Status","Actions"].map((h, i) => (
                  <th key={i} className="apple-table-header">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 text-[#86868b] text-sm">No leads found</td></tr>
                ) : leads.map(l => (
                  <tr key={l.customerId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{l.name}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.phone}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.city}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.interestedModel}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.employeeName || "—"}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]">{l.leadStatus}</span>
                    </td>
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(l.customerId, "CONTACTED")}>Contacted</button>
                        <button className={btnOutline} onClick={() => updateStatus(l.customerId, "BOOKED")}>Booked</button>
                        <button className={btnDanger}  onClick={() => updateStatus(l.customerId, "LOST")}>Lost</button>
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
    </DealerLayout>
  );
}
