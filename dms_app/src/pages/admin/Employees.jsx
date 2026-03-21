import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = () => {
    api.get("/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadEmployees(); }, []);

  const deleteEmployee = (id) => {
    api.delete(`/employees/${id}`).then(() => loadEmployees()).catch(err => console.log(err));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Employees</h1>

        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                <tr className="text-gray-500 dark:text-gray-400 text-sm">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Dealer</th>
                  <th className="p-4 font-medium">City</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-6 text-gray-400">No employees found</td></tr>
                ) : employees.map(e => (
                  <tr key={e.employeeId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{e.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.phone}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.email}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.dealerName || "—"}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.dealerCity || "—"}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{e.role}</td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteEmployee(e.employeeId)}
                        className="text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded transition-colors"
                      >
                        Remove
                      </button>
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
