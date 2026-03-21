import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, Trash2, X } from "lucide-react";
import { SkeletonTable } from "../../components/Skeleton";

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    dealerName: "", email: "", phone: "", city: "", state: "", address: ""
  });

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
    api.delete(`/dealers/${id}`)
      .then(() => loadDealers())
      .catch(err => console.log(err));
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Dealers</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <PlusCircle size={18} />
            Add Dealer
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="border-b border-gray-200 dark:border-slate-800">
                <tr className="text-gray-600 dark:text-gray-300 text-sm">
                  <th className="p-4">Dealer Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dealers.map((dealer) => (
                  <tr key={dealer.dealerId} className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{dealer.dealerName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{dealer.phone}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{dealer.email}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{dealer.city}</td>
                    <td className="p-4">
                      {dealer.active ? (
                        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">ACTIVE</span>
                      ) : (
                        <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">INACTIVE</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteDealer(dealer.dealerId)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ADD DEALER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Add Dealer</h2>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            {["dealerName", "email", "phone", "city", "state", "address"].map(field => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                value={form[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2"
              />
            ))}
            <button
              onClick={addDealer}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              Create Dealer
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
