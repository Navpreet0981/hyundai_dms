import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { UserPlus, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";

export default function DealerEmployees() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const loadEmployees = () => {
    api.get("/dealer/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadEmployees(); }, []);

  const handleDeactivate = () => {
    if (!selectedId) return;
    setActionLoading(true);
    api.delete(`/dealer/employees/${selectedId}`)
      .then(() => { setSelectedId(null); loadEmployees(); })
      .catch(err => console.log(err))
      .finally(() => setActionLoading(false));
  };

  return (
    <DealerLayout>
      <div className="space-y-6">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Employees</h1>
          <button
            onClick={() => navigate("/dealer/add-employee")}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors w-full sm:w-auto justify-center"
          >
            <UserPlus size={16} />
            Add Employee
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-4 text-left font-medium">Name</th>
                  <th className="p-4 text-left font-medium">Phone</th>
                  <th className="p-4 text-left font-medium">Email</th>
                  <th className="p-4 text-left font-medium">Role</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-6 text-gray-400">No employees found</td></tr>
                ) : employees.map(e => (
                  <tr key={e.employeeId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{e.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.phone}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.email}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.role}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full ${e.status === "ACTIVE" ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-gray-100 dark:bg-slate-800 text-gray-400"}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {e.status === "ACTIVE" && (
                        <button
                          onClick={() => setSelectedId(e.employeeId)}
                          className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded transition-colors"
                        >
                          <UserX size={13} /> Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CONFIRM MODAL */}
        {selectedId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg w-full max-w-sm border border-gray-200 dark:border-slate-700">
              <h2 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200">Deactivate Employee</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This employee will be marked as inactive and lose access.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setSelectedId(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={actionLoading}
                  className="px-4 py-2 text-sm text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-colors"
                >
                  {actionLoading && <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />}
                  Confirm Deactivation
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DealerLayout>
  );
}
