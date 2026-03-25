import { useEffect, useState, useCallback } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, X, Search, Eye, EyeOff } from "lucide-react";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

function buildUrl(page, size, search) {
  const params = new URLSearchParams({ page, size });
  if (search.trim()) params.set("search", search.trim());
  return `/dealers/paged?${params.toString()}`;
}

export default function Dealers() {
  const [dealers, setDealers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [search, setSearch]         = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const emptyForm = { dealerName: "", email: "", phone: "", city: "", state: "", address: "", password: "", active: true };
  const [form, setForm] = useState(emptyForm);
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t);
  }, [search, setPage]);

  const fetchData = useCallback(() => {
    setLoading(true);
    api.get(buildUrl(page, size, debouncedSearch))
      .then(res => { setDealers(res.data.content); setTotalPages(res.data.totalPages); })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [page, size, debouncedSearch, setTotalPages]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addDealer = () => {
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    api.post("/dealers", form)
      .then(() => {
        setShowModal(false);
        setForm(emptyForm);
        setShowPassword(false);
        fetchData();
      })
      .catch(err => setError(err.response?.data?.message || "Failed to create dealer."));
  };

  const deleteDealer = (id) => {
    api.delete(`/dealers/${id}`).then(() => fetchData()).catch(err => console.log(err));
  };

  return (
    <AdminLayout>
      <div className="space-y-5">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="apple-title">Dealers</h1>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text"
                placeholder="Search dealers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                  bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                  placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3]
                  w-52 transition-all"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="apple-btn-primary flex items-center gap-2"
            >
              <PlusCircle size={15} /> Add Dealer
            </button>
          </div>
        </div>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Dealer Name","Phone","Email","City","Status",""].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dealers.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-[#86868b] text-sm">
                    {debouncedSearch ? `No dealers found for "${debouncedSearch}"` : "No dealers found"}
                  </td></tr>
                ) : dealers.map(d => (
                  <tr key={d.dealerId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{d.dealerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{d.phone}</td>
                    <td className="apple-table-cell text-[#86868b]">{d.email}</td>
                    <td className="apple-table-cell text-[#86868b]">{d.city}</td>
                    <td className="apple-table-cell">
                      <span className={`apple-badge ${d.active
                        ? "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]"
                        : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]"}`}>
                        {d.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="apple-table-cell">
                      <button
                        onClick={() => deleteDealer(d.dealerId)}
                        className="text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}

      </div>

      {/* ADD DEALER MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-md p-6 space-y-3 shadow-apple-lg">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Add New Dealer</h2>
              <button
                onClick={() => { setShowModal(false); setError(""); setShowPassword(false); setForm(emptyForm); }}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {["dealerName","email","phone","city","state","address"].map(field => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                value={form[field]}
                onChange={handleChange}
                className="apple-input"
              />
            ))}

            {/* Password field with show/hide */}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)"
                value={form.password}
                onChange={handleChange}
                className="apple-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowModal(false); setError(""); setShowPassword(false); setForm(emptyForm); }}
                className="apple-btn-secondary flex-1"
              >
                Cancel
              </button>
              <button onClick={addDealer} className="apple-btn-primary flex-1">Create Dealer</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
