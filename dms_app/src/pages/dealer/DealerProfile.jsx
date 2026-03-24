import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonProfile } from "../../components/Skeleton";

export default function DealerProfile() {
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({ employees: 0, leads: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

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
    </DealerLayout>
  );
}
