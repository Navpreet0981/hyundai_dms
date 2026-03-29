import { useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";

function PasswordField({ placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="apple-input pr-10"
      />
      <button type="button" onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function AdminProfile() {
  const email = localStorage.getItem("email") || "—";

  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow]           = useState({ current: false, next: false, confirm: false });
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [loading, setLoading]     = useState(false);

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setError(""); setSuccess("");
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShow({ current: false, next: false, confirm: false });
    setError(""); setSuccess("");
  };

  const handleSubmit = () => {
    if (!form.currentPassword) { setError("Current password is required."); return; }
    if (form.newPassword.length < 6) { setError("New password must be at least 6 characters."); return; }
    if (form.newPassword !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    api.put("/admin/change-password", {
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    })
      .then(() => {
        setSuccess("Password updated successfully.");
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      })
      .catch(err => setError(err.response?.data || "Failed to update password."))
      .finally(() => setLoading(false));
  };

  return (
    <AdminLayout>
      <div className="flex justify-center px-2 sm:px-0">
        <div className="w-full max-w-xl space-y-4">

          {/* Profile info card */}
          <div className="apple-card p-5 sm:p-6 space-y-4">
            <h1 className="apple-title">Admin Profile</h1>
            <div className="space-y-0.5">
              <p className="apple-label">Email</p>
              <p className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{email}</p>
            </div>
            <div className="space-y-0.5">
              <p className="apple-label">Role</p>
              <span className="apple-badge bg-[#e8f4fd] dark:bg-[#0071e3]/20 text-[#0071e3]">ADMIN</span>
            </div>

            {/* Change password trigger button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-sm text-[#0071e3] hover:underline mt-2">
              <KeyRound size={14} /> Change Password
            </button>
          </div>

        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-sm p-6 space-y-4 shadow-apple-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <KeyRound size={16} className="text-[#0071e3]" />
                <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Change Password</h2>
              </div>
              <button onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors">
                <X size={16} />
              </button>
            </div>

            <PasswordField placeholder="Current password" value={form.currentPassword}
              onChange={set("currentPassword")} show={show.current}
              onToggle={() => setShow(s => ({ ...s, current: !s.current }))} />
            <PasswordField placeholder="New password (min 6 characters)" value={form.newPassword}
              onChange={set("newPassword")} show={show.next}
              onToggle={() => setShow(s => ({ ...s, next: !s.next }))} />
            <PasswordField placeholder="Re-enter new password" value={form.confirmPassword}
              onChange={set("confirmPassword")} show={show.confirm}
              onToggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))} />

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            {success && (
              <p className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                {success}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={closeModal} className="apple-btn-secondary flex-1">Cancel</button>
              <button onClick={handleSubmit} disabled={loading}
                className="apple-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
