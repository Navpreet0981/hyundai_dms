import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, X, Search, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { useDealersPaged } from "../../hooks/useQueries";

export default function Dealers() {
  // Access TanStack query client to manually invalidate cache after mutations
  const qc = useQueryClient();

  const [showModal, setShowModal]             = useState(false);
  const [search, setSearch]                   = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [error, setError]                     = useState("");

  // Empty form template — reused to reset form after submit or cancel
  const emptyForm = { dealerName: "", email: "", phone: "", city: "", state: "", address: "", password: "", active: true };
  const [form, setForm] = useState(emptyForm);

  // Pagination state: current page, page size, total pages
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  // Reassign modal state — null means closed, dealer object means open
  const [reassignDealer, setReassignDealer] = useState(null);
  const [targetDealerId, setTargetDealerId] = useState("");
  const [reassignLoading, setReassignLoading] = useState(false);
  const [reassignError, setReassignError]   = useState("");

  // Debounce search input — waits 400ms after user stops typing before firing query
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(0); }, 400);
    return () => clearTimeout(t); // cleanup cancels timer if user types again before 400ms
  }, [search, setPage]);

  // Fetch paginated dealers — query key includes page, size, search so cache is per-combination
  const { data, isLoading: loading } = useDealersPaged(page, size, debouncedSearch);
  const dealers = data?.content ?? []; // Spring Page wraps results in .content array
  const totalPagesFromQuery = data?.totalPages ?? 0;

  // Sync total pages from query response into pagination hook
  useEffect(() => { setTotalPages(totalPagesFromQuery); }, [totalPagesFromQuery, setTotalPages]);

  // Invalidate dealers cache so table refetches after any mutation
  const invalidate = () => qc.invalidateQueries({ queryKey: ['dealers-paged'] });

  // Generic form field change handler — updates the matching key in form state
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Validate and submit new dealer to POST /dealers, then reset and refresh table
  const addDealer = () => {
    if (!form.password || form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    api.post("/dealers", form)
      .then(() => { setShowModal(false); setForm(emptyForm); setShowPassword(false); invalidate(); })
      .catch(err => setError(err.response?.data?.message || "Failed to create dealer."));
  };

  // Open reassign modal for a specific dealer and reset its state
  const openReassignModal = (dealer) => { setReassignDealer(dealer); setTargetDealerId(""); setReassignError(""); };

  // Close reassign modal and clear all its state
  const closeReassignModal = () => { setReassignDealer(null); setTargetDealerId(""); setReassignError(""); };

  // Bulk-reassign all dealer data to target, then soft-deactivate the old dealer
  const handleReassignAndDelete = () => {
    if (!targetDealerId) { setReassignError("Please select a dealer to reassign to."); return; }
    setReassignLoading(true);
    setReassignError("");
    api.put(`/dealers/${reassignDealer.dealerId}/reassign?targetDealerId=${targetDealerId}`)
      .then(() => { closeReassignModal(); invalidate(); })
      .catch(err => setReassignError(err.response?.data?.message || "Failed to reassign dealer."))
      .finally(() => setReassignLoading(false)); // always clear spinner regardless of outcome
  };

  // Filter out the dealer being removed from the reassign dropdown — can't reassign to self
  const otherDealers = reassignDealer ? dealers.filter(d => d.dealerId !== reassignDealer.dealerId) : [];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="apple-title">Dealers</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]" />
              <input
                type="text" placeholder="Search dealers…" value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                  bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                  placeholder-[#86868b] focus:outline-none focus:ring-2 focus:ring-[#0071e3] w-52 transition-all"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="apple-btn-primary flex items-center gap-2">
              <PlusCircle size={15} /> Add Dealer
            </button>
          </div>
        </div>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>{["Dealer Name","Phone","Email","City","Status",""].map((h, i) => <th key={i} className="apple-table-header">{h}</th>)}</tr>
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
                      {/* Active/Inactive badge — green for active, grey for inactive */}
                      <span className={`apple-badge ${d.active
                        ? "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]"
                        : "bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#86868b]"}`}>
                        {d.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="apple-table-cell">
                      {/* Opens reassign modal — forces data migration before deactivation */}
                      <button onClick={() => openReassignModal(d)}
                        className="text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-lg transition-colors">
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
              {/* Close button resets form and clears any error */}
              <button onClick={() => { setShowModal(false); setError(""); setShowPassword(false); setForm(emptyForm); }}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors">
                <X size={16} />
              </button>
            </div>
            {/* Dynamically render text inputs for all non-password fields */}
            {["dealerName","email","phone","city","state","address"].map(field => (
              <input key={field} name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                value={form[field]} onChange={handleChange} className="apple-input" />
            ))}
            {/* Password field with show/hide toggle */}
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"}
                placeholder="Password (min 6 characters)" value={form.password}
                onChange={handleChange} className="apple-input pr-10" />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button onClick={() => { setShowModal(false); setError(""); setShowPassword(false); setForm(emptyForm); }} className="apple-btn-secondary flex-1">Cancel</button>
              <button onClick={addDealer} className="apple-btn-primary flex-1">Create Dealer</button>
            </div>
          </div>
        </div>
      )}

      {/* REASSIGN DEALER MODAL — shown when reassignDealer is not null */}
      {reassignDealer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-md p-6 shadow-apple-lg">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-2 rounded-xl bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle size={16} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Remove Dealer</h2>
                  <p className="text-sm text-[#86868b] mt-0.5">
                    Reassign all data from <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{reassignDealer.dealerName}</span> before removing.
                  </p>
                </div>
              </div>
              <button onClick={closeReassignModal} className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors"><X size={16} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">Reassign employees, bookings & customers to</label>
                {/* Dropdown excludes the dealer being removed — otherDealers filters it out */}
                <select value={targetDealerId} onChange={e => { setTargetDealerId(e.target.value); setReassignError(""); }}
                  className="w-full text-sm rounded-xl border border-[#e5e5ea] dark:border-[#3a3a3c]
                    bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                    px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all">
                  <option value="">Select a dealer…</option>
                  {otherDealers.map(d => <option key={d.dealerId} value={d.dealerId}>{d.dealerName} — {d.city}</option>)}
                </select>
              </div>
              {reassignError && <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{reassignError}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={closeReassignModal} className="apple-btn-secondary flex-1">Cancel</button>
                {/* Disabled until a target dealer is selected */}
                <button onClick={handleReassignAndDelete} disabled={reassignLoading || !targetDealerId}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-xl transition-colors">
                  {reassignLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Reassign & Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
