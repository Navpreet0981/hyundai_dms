import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";

const btnPrimary = "px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors";
const btnDanger = "px-3 py-1 text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors";

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
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-4 text-left font-medium">Customer</th>
                  <th className="p-4 text-left font-medium">Variant</th>
                  <th className="p-4 text-left font-medium">Employee</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testDrives.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-6 text-gray-400">No test drives found</td></tr>
                ) : testDrives.map(t => (
                  <tr key={t.testDriveId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{t.customerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.variantName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.employeeName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.testDriveDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(t.testDriveId, "CONFIRMED")}>Confirm</button>
                        <button className={btnOutline} onClick={() => updateStatus(t.testDriveId, "COMPLETED")}>Mark Completed</button>
                        <button className={btnDanger} onClick={() => updateStatus(t.testDriveId, "CANCELLED")}>Cancel</button>
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
