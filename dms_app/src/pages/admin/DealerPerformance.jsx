import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";

export default function DealerPerformance() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDealers = () => {
    api.get("/admin/dealer-performance")
      .then(res => setDealers(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDealers(); }, []);

  const toggleDealer = (id, active) => {
    api.put(`/dealers/${id}/status`, { active: !active }).then(() => loadDealers());
  };

  const deleteDealer = (id) => {
    if (window.confirm("Delete this dealer?")) {
      api.delete(`/dealers/${id}`).then(() => loadDealers());
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        <div>
          <h1 className="apple-title">Dealer Performance</h1>
          <p className="apple-subtitle mt-1">Monitor and manage dealer activity</p>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  <th className="apple-table-header">Dealer</th>
                  <th className="apple-table-header">Employees</th>
                  <th className="apple-table-header">Leads</th>
                  <th className="apple-table-header">Bookings</th>
                  <th className="apple-table-header">Conversion</th>
                  <th className="apple-table-header">Status</th>
                  <th className="apple-table-header">Actions</th>
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
                          className="apple-btn-secondary !px-3 !py-1.5 !text-xs"
                        >
                          {dealer.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => deleteDealer(dealer.dealerId)}
                          className="px-3 py-1.5 text-xs text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
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
    </AdminLayout>
  );
}
