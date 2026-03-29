import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonProfile } from "../../components/Skeleton";
import { Eye, EyeOff, KeyRound, X } from "lucide-react";

function PasswordField({ placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="relative">
      <input type={show ? "text" : "password"} placeholder={placeholder}
        value={value} onChange={onChange} className="apple-input pr-10" />
      <button type="button" onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function DealerProfile() {
  const [profile, setProfile] = useState({});
  const [stats, setStats]     = useState({ employees: 0, leads: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [pwForm, setPwForm]       = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow]           = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError]     = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/dealer/profile").then(res => setProfile(res.data)).catch(() => {}),
      api.get("/dealer/dashboard").then(res => setStats({
        employees: res.data.totalEmployees || 0,
        leads: res.data.totalLeads || 0,
        bookings: res.data.totalBookings || 0
      })).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const set = (field) => (e) => {
    setPwForm(f => ({ ...f, [field]: e.target.value }));
    setPwError(""); setPwSuccess("");
  };

  const closeModal = () => {
    setShowModal(false);
    setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShow({ current: false, next: false, confirm: false });
    setPwError(""); setPwSuccess("");
  };

  const handleChangePassword = () => {
    if (!pwForm.currentPassword) { setPwError("Current password is required."); return; }
    if (pwForm.newPassword.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError("Passwords do not match."); return; }
    setPwLoading(true);
    api.put("/dealer/change-password", {
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    })
      .then(() => { setPwSuccess("Password updated successfully."); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); })
      .catch(err => setPwError(err.response?.data || "Failed to update password."))
      .finally(() => setPwLoading(false));
  };

  const fields = [
    { label: "Name",    value: profile.dealerName },
    { label: "Email",   value: profile.email },
    { label: "Phone",   value: profile.phone },
    { label: "City",    value: profile.city },
    { label: "State",   value: profile.state },
    { label: "Address", value: profile.address },
  ];

  const statCards = [
    { label: "Employees", value: stats.employees, color: "#0071e3", bg: "bg-[#0071e3]/10" },
    { label: "Leads",     value: stats.leads,     color: "#bf5af2", bg: "bg-[#bf5af2]/10" },
    { label: "Bookings",  value: stats.bookings,  color: "#30d158", bg: "bg-[#30d158]/10" },
  ];

  return (
    <DealerLayout>
      <div className="flex justify-center px-2 sm:px-0">
        {loading ? <SkeletonProfile /> : (
          <div className="w-full max-w-xl space-y-4">

            <div className="apple-card p-5 sm:p-6 space-y-4">
              <h1 className="apple-title">Dealer Profile</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {fields.map((f, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="apple-label">{f.label}</p>
                    <p className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">{f.value || "—"}</p>
                  </div>
                ))}
              </div>
              <div className="pt-1">
                <p className="apple-label mb-1">Status</p>
                <span className={`apple-badge ${profile.active
                  ? "bg-[#d1fae5] dark:bg-[#052e16] text-[#065f46] dark:text-[#34d399]"
                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>
                  {profile.active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Change password trigger */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-sm text-[#0071e3] hover:underline mt-1">
                <KeyRound size={14} /> Change Password
              </button>
            </div>

            <div className="apple-card p-5 sm:p-6">
              <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Performance Summary</h2>
              <div className="grid grid-cols-3 gap-3">
                {statCards.map((s, i) => (
                  <div key={i} className={`${s.bg} rounded-2xl p-4 text-center`}>
                    <p className="text-xs text-[#86868b] mb-1">{s.label}</p>
                    <p className="text-xl font-semibold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
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

            <PasswordField placeholder="Current password" value={pwForm.currentPassword}
              onChange={set("currentPassword")} show={show.current}
              onToggle={() => setShow(s => ({ ...s, current: !s.current }))} />
            <PasswordField placeholder="New password (min 6 characters)" value={pwForm.newPassword}
              onChange={set("newPassword")} show={show.next}
              onToggle={() => setShow(s => ({ ...s, next: !s.next }))} />
            <PasswordField placeholder="Re-enter new password" value={pwForm.confirmPassword}
              onChange={set("confirmPassword")} show={show.confirm}
              onToggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))} />

            {pwError && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                {pwSuccess}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={closeModal} className="apple-btn-secondary flex-1">Cancel</button>
              <button onClick={handleChangePassword} disabled={pwLoading}
                className="apple-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                {pwLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </DealerLayout>
  );
}
