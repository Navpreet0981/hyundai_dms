import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { SkeletonProfile } from "../../components/Skeleton";
import { Users, Car, CalendarCheck, Eye, EyeOff, KeyRound, X } from "lucide-react";

// Reusable password input with show/hide toggle — used for all three password fields
function PasswordField({ placeholder, value, onChange, show, onToggle }) {
  return (
    <div className="relative">
      <input type={show ? "text" : "password"} placeholder={placeholder}
        value={value} onChange={onChange} className="apple-input pr-10" />
      {/* Toggle switches between text and password input type */}
      <button type="button" onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors">
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [stats, setStats]     = useState({ leads: 0, testDrives: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  // Change password modal state
  const [showModal, setShowModal] = useState(false);
  const [pwForm, setPwForm]       = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow]           = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError]     = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Fetch profile and stats in parallel — stats use array length from list endpoints
  useEffect(() => {
    Promise.all([
      api.get("/employees/me").then(res => setProfile(res.data)).catch(() => {}),
      api.get("/customers").then(res => setStats(prev => ({ ...prev, leads: res.data.length }))).catch(() => {}),
      api.get("/testdrives").then(res => setStats(prev => ({ ...prev, testDrives: res.data.length }))).catch(() => {}),
      api.get("/bookings").then(res => setStats(prev => ({ ...prev, bookings: res.data.length }))).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  // Curried handler — returns onChange for a specific field, clears messages on keystroke
  const set = (field) => (e) => {
    setPwForm(f => ({ ...f, [field]: e.target.value }));
    setPwError(""); setPwSuccess("");
  };

  // Reset all modal state — called on cancel or after successful update
  const closeModal = () => {
    setShowModal(false);
    setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setShow({ current: false, next: false, confirm: false });
    setPwError(""); setPwSuccess("");
  };

  // Validate inputs then call PUT /employees/change-password — backend verifies current password
  const handleChangePassword = () => {
    if (!pwForm.currentPassword) { setPwError("Current password is required."); return; }
    if (pwForm.newPassword.length < 6) { setPwError("New password must be at least 6 characters."); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError("Passwords do not match."); return; }
    setPwLoading(true);
    api.put("/employees/change-password", {
      currentPassword: pwForm.currentPassword,
      newPassword: pwForm.newPassword,
    })
      .then(() => { setPwSuccess("Password updated successfully."); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); })
      .catch(err => setPwError(err.response?.data || "Failed to update password."))
      .finally(() => setPwLoading(false));
  };

  // Performance stat card config — values from parallel API calls
  const statItems = [
    { label: "Leads",       value: stats.leads,      Icon: Users,         bg: "bg-blue-50 dark:bg-blue-900/20",    color: "text-[#0071e3]" },
    { label: "Test Drives", value: stats.testDrives, Icon: Car,           bg: "bg-purple-50 dark:bg-purple-900/20", color: "text-purple-600" },
    { label: "Bookings",    value: stats.bookings,   Icon: CalendarCheck, bg: "bg-green-50 dark:bg-green-900/20",   color: "text-[#34c759]" }
  ];

  return (
    <EmployeeLayout>
      <div className="flex justify-center px-2 sm:px-0">
        {loading ? <SkeletonProfile /> : (
          <div className="w-full max-w-xl space-y-4">

            <h1 className="apple-title text-center">My Profile</h1>

            {/* Employee details card — shows name, email, phone, role + change password trigger */}
            <div className="apple-card p-5 sm:p-6 space-y-4">
              <h2 className="apple-label">Employee Details</h2>
              <div className="space-y-3">
                {[
                  { label: "Name",  value: profile.name },
                  { label: "Email", value: profile.email },
                  { label: "Phone", value: profile.phone },
                  { label: "Role",  value: profile.role }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#e5e5ea] dark:border-[#2c2c2e] last:border-0">
                    <span className="apple-subtitle text-sm">{label}</span>
                    <span className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{value || "—"}</span>
                  </div>
                ))}
              </div>

              {/* Trigger button — opens change password modal */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-sm text-[#0071e3] hover:underline mt-1">
                <KeyRound size={14} /> Change Password
              </button>
            </div>

            {/* Dealer info card — shows which dealership this employee belongs to */}
            <div className="apple-card p-5 sm:p-6 space-y-4">
              <h2 className="apple-label">Dealer Information</h2>
              <div className="space-y-3">
                {[
                  { label: "Dealer", value: profile.dealerName },
                  { label: "City",   value: profile.dealerCity },
                  { label: "State",  value: profile.dealerState }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#e5e5ea] dark:border-[#2c2c2e] last:border-0">
                    <span className="apple-subtitle text-sm">{label}</span>
                    <span className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance summary — stat cards from parallel API calls */}
            <div className="apple-card p-5 sm:p-6 space-y-4">
              <h2 className="apple-label">Performance Summary</h2>
              <div className="grid grid-cols-3 gap-3">
                {statItems.map(({ label, value, Icon, bg, color }) => (
                  <div key={label} className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2`}>
                    <div className={color}><Icon size={20} /></div>
                    <p className={`text-2xl font-semibold tracking-tight ${color}`}>{value}</p>
                    <p className="apple-label text-center">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* CHANGE PASSWORD MODAL — conditionally rendered when showModal is true */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-sm p-6 space-y-4 shadow-apple-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <KeyRound size={16} className="text-[#0071e3]" />
                <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Change Password</h2>
              </div>
              {/* X button resets all modal state */}
              <button onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Three password fields — each has independent show/hide state */}
            <PasswordField placeholder="Current password" value={pwForm.currentPassword}
              onChange={set("currentPassword")} show={show.current}
              onToggle={() => setShow(s => ({ ...s, current: !s.current }))} />
            <PasswordField placeholder="New password (min 6 characters)" value={pwForm.newPassword}
              onChange={set("newPassword")} show={show.next}
              onToggle={() => setShow(s => ({ ...s, next: !s.next }))} />
            <PasswordField placeholder="Re-enter new password" value={pwForm.confirmPassword}
              onChange={set("confirmPassword")} show={show.confirm}
              onToggle={() => setShow(s => ({ ...s, confirm: !s.confirm }))} />

            {/* Error message — shown on validation failure or API error */}
            {pwError && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                {pwError}
              </p>
            )}
            {/* Success message — shown after successful password update */}
            {pwSuccess && (
              <p className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
                {pwSuccess}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button onClick={closeModal} className="apple-btn-secondary flex-1">Cancel</button>
              {/* Disabled while API call is in flight */}
              <button onClick={handleChangePassword} disabled={pwLoading}
                className="apple-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                {pwLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </EmployeeLayout>
  );
}
