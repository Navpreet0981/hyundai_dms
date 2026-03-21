import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = () => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCustomers(); }, []);

  const deleteCustomer = (id) => {
    api.delete(`/customers/${id}`).then(() => loadCustomers()).catch(err => console.log(err));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Customer Leads</h1>

        {loading ? (
          <SkeletonTable rows={6} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                <tr className="text-gray-500 dark:text-gray-400 text-sm">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">City</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Model</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan="8" className="text-center p-6 text-gray-400">No customers found</td></tr>
                ) : customers.map(c => (
                  <tr key={c.customerId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{c.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{c.phone}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{c.email}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{c.city}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{c.leadSource}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{c.interestedModel}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {c.leadStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteCustomer(c.customerId)}
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
