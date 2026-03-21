import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { SkeletonTable } from "../../components/Skeleton";

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
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Variant</th>
                  <th className="p-4 text-left">Dealer</th>
                  <th className="p-4 text-left">Issue</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(r => (
                  <tr key={r.serviceRequestId} className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                    <td className="p-4 text-gray-800 dark:text-gray-200">{r.customerName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{r.variantName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{r.dealerName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{r.issueDescription}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{r.serviceDate}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">{r.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded" onClick={() => updateStatus(r.serviceRequestId, "IN_PROGRESS")}>Start</button>
                        <button className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded" onClick={() => updateStatus(r.serviceRequestId, "CLOSED")}>Close</button>
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
