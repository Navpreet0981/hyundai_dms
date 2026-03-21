import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";

export default function DealerTestDrives() {
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTestDrives = () => {
    api.get("/testdrives")
      .then(res => setTestDrives(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadTestDrives(); }, []);

  const updateStatus = (id, status) => {
    api.put(`/testdrives/${id}/status?status=${status}`)
      .then(() => loadTestDrives())
      .catch(err => console.log(err));
  };

  return (
    <DealerLayout>
      <div className="space-y-6">

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Test Drives</h2>

        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Variant</th>
                  <th className="p-4 text-left">Employee</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testDrives.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-6 text-gray-500">No test drives found</td></tr>
                ) : testDrives.map(t => (
                  <tr key={t.testDriveId} className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{t.customerName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{t.variantName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{t.employeeName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{t.testDriveDate}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">{t.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded" onClick={() => updateStatus(t.testDriveId, "CONFIRMED")}>Confirm</button>
                        <button className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded" onClick={() => updateStatus(t.testDriveId, "COMPLETED")}>Complete</button>
                        <button className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded" onClick={() => updateStatus(t.testDriveId, "CANCELLED")}>Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DealerLayout>
  );
}
