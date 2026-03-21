import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, X } from "lucide-react";
import { SkeletonTable } from "../../components/Skeleton";

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ dealerName: "", email: "", phone: "", city: "", state: "", address: "" });

  const loadDealers = () => {
    api.get("/dealers")
      .then(res => setDealers(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadDealers(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDealer = () => {
    api.post("/dealers", form)
      .then(() => {
        setShowModal(false);
        setForm({ dealerName: "", email: "", phone: "", city: "", state: "", address: "" });
        loadDealers();
      })
      .catch(err => console.log(err));
  };

  const deleteDealer = (id) => {
    api.delete(`/dealers/${id}`).then(() => loadDealers()).catch(err => console.log(err));
  };

  const inputCls = "w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400";

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Dealers</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <PlusCircle size={16} /> Add Dealer
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                <tr className="text-gray-500 dark:text-gray-400 text-sm">
                  <th className="p-4 font-medium">Dealer Name</th>
                  <th className="p-4 font-medium">Phone</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">City</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dealers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-6 text-gray-400">No dealers found</td></tr>
                ) : dealers.map((dealer) => (
                  <tr key={dealer.dealerId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{dealer.dealerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{dealer.phone}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{dealer.email}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{dealer.city}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full ${dealer.active ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300" : "bg-gray-100 dark:bg-slate-800 text-gray-400"}`}>
                        {dealer.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteDealer(dealer.dealerId)}
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

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 border border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Add New Dealer</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={18} /></button>
            </div>
            {["dealerName", "email", "phone", "city", "state", "address"].map(field => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                value={form[field]}
                onChange={handleChange}
                className={inputCls}
              />
            ))}
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={addDealer} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors">Create Dealer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
