import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";
import { useAdminDealerPerf } from "../../hooks/useQueries";
import { AlertTriangle, X } from "lucide-react";

export default function DealerPerformance() {
  const qc = useQueryClient();
  const { data: dealers = [], isLoading: loading } = useAdminDealerPerf();

  const [reassignDealer, setReassignDealer] = useState(null);
  const [targetDealerId, setTargetDealerId] = useState("");
  const [reassignLoading, setReassignLoading] = useState(false);
  const [reassignError, setReassignError] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin-dealer-perf'] });

  const toggleDealer = (id, active) => {
    api.put(`/dealers/${id}/status`, { active: !active }).then(invalidate).catch(err => console.log(err));
  };

  const openReassignModal = (dealer) => { setReassignDealer(dealer); setTargetDealerId(""); setReassignError(""); };
  const closeReassignModal = () => { setReassignDealer(null); setTargetDealerId(""); setReassignError(""); };

  const handleReassignAndDelete = () => {
    if (!targetDealerId) { setReassignError("Please select a dealer to reassign to."); return; }
    setReassignLoading(true);
    setReassignError("");
    api.put(`/dealers/${reassignDealer.dealerId}/reassign?targetDealerId=${targetDealerId}`)
      .then(() => { closeReassignModal(); invalidate(); })
      .catch(err => setReassignError(err.response?.data?.message || "Failed to reassign dealer."))
      .finally(() => setReassignLoading(false));
  };

  const otherDealers = reassignDealer
    ? dealers.filter(d => d.dealerId !== reassignDealer.dealerId)
    : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="apple-title">Dealer Performance</h1>
          <p className="apple-subtitle mt-1">Monitor and manage dealer activity</p>
        </div>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Dealer","Employees","Leads","Bookings","Conversion","Status","Actions"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dealers.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 apple-subtitle">No dealers found</td></tr>
                ) : dealers.map(dealer => (
                  <tr key={dealer.dealerId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{dealer.dealerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{dealer.totalEmployees}</td>
                    <td className="apple-table-cell text-[#86868b]">{dealer.totalLeads}</td>
                    <td className="apple-table-cell text-[#86868b]">{dealer.totalBookings}</td>
                    <td className="apple-table-cell font-semibold text-[#0071e3]">{dealer.conversionRate}%</td>
                    <td className="apple-table-cell">
                      <span className={`apple-badge ${dealer.active
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                        : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]"}`}>
                        {dealer.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleDealer(dealer.dealerId, dealer.active)}
                          className="apple-btn-secondary !px-3 !py-1.5 !text-xs">
                          {dealer.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => openReassignModal(dealer)}
                          className="px-3 py-1.5 text-xs text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* REASSIGN DEALER MODAL */}
      {reassignDealer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-md p-6 shadow-apple-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-xl bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Remove Dealer</h2>
                  <p className="text-sm text-[#86868b] mt-0.5">
                    Reassign all data from{" "}
                    <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{reassignDealer.dealerName}</span>{" "}
                    before removing.
                  </p>
                </div>
              </div>
              <button onClick={closeReassignModal}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">
                  Reassign employees, bookings & customers to
                </label>
                <select
                  value={targetDealerId}
                  onChange={e => { setTargetDealerId(e.target.value); setReassignError(""); }}
                  className="w-full text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                    bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                    px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all">
                  <option value="">Select a dealer…</option>
                  {otherDealers.map(d => (
                    <option key={d.dealerId} value={d.dealerId}>{d.dealerName}</option>
                  ))}
                </select>
              </div>

              {reassignError && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                  {reassignError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button onClick={closeReassignModal} className="apple-btn-secondary flex-1">Cancel</button>
                <button
                  onClick={handleReassignAndDelete}
                  disabled={reassignLoading || !targetDealerId}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-xl transition-colors">
                  {reassignLoading && (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Reassign & Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
