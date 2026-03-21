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

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Dealer Performance</h1>

        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                <tr className="text-gray-500 dark:text-gray-400 text-sm">
                  <th className="p-4 font-medium">Dealer</th>
                  <th className="p-4 font-medium">Employees</th>
                  <th className="p-4 font-medium">Leads</th>
                  <th className="p-4 font-medium">Bookings</th>
                  <th className="p-4 font-medium">Conversion</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dealers.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-6 text-gray-400">No data found</td></tr>
                ) : dealers.map(dealer => (
                  <tr key={dealer.dealerId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{dealer.dealerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{dealer.totalEmployees}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{dealer.totalLeads}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{dealer.totalBookings}</td>
                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{dealer.conversionRate}%</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full ${dealer.active ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-gray-100 dark:bg-slate-800 text-gray-400"}`}>
                        {dealer.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleDealer(dealer.dealerId, dealer.active)}
                          className="px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          {dealer.active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => deleteDealer(dealer.dealerId)}
                          className="px-3 py-1 text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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
