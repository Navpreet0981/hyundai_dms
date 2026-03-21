import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { PlusCircle, UserX } from "lucide-react";
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
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow w-full sm:w-auto justify-center"
          >
            <PlusCircle size={18} />
            Add Employee
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-6 text-gray-500">No employees found</td></tr>
                ) : employees.map(e => (
                  <tr key={e.employeeId} className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{e.name}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{e.phone}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{e.email}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{e.role}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${e.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {e.status === "ACTIVE" && (
                        <button
                          onClick={() => setSelectedId(e.employeeId)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                        >
                          <UserX size={16} /> Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Deactivate Employee</h2>
              <p className="text-sm text-gray-500 mb-6">This employee will be marked as inactive.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setSelectedId(null)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300">Cancel</button>
                <button onClick={handleDeactivate} disabled={actionLoading} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2">
                  {actionLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DealerLayout>
  );
}
