import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { SkeletonTable } from "../../components/Skeleton";

const btnPrimary = "px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors";

export default function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = () => {
    api.get("/service-requests")
      .then(res => setRequests(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRequests(); }, []);

  const updateStatus = (id, status) => {
    api.put(`/service-requests/${id}/status?status=${status}`)
      .then(() => loadRequests())
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Service Requests</h2>

        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-4 text-left font-medium">Customer</th>
                  <th className="p-4 text-left font-medium">Variant</th>
                  <th className="p-4 text-left font-medium">Dealer</th>
                  <th className="p-4 text-left font-medium">Issue</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-6 text-gray-400">No service requests found</td></tr>
                ) : requests.map(r => (
                  <tr key={r.serviceRequestId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 text-gray-800 dark:text-gray-200">{r.customerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{r.variantName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{r.dealerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{r.issueDescription}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{r.serviceDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(r.serviceRequestId, "IN_PROGRESS")}>Start Service</button>
                        <button className={btnOutline} onClick={() => updateStatus(r.serviceRequestId, "CLOSED")}>Mark Closed</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}
