import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { SkeletonProfile } from "../../components/Skeleton";
import { Users, Car, CalendarCheck } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [stats, setStats] = useState({ leads: 0, testDrives: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/employees/me").then(res => setProfile(res.data)).catch(() => {}),
      api.get("/customers").then(res => setStats(prev => ({ ...prev, leads: res.data.length }))).catch(() => {}),
      api.get("/testdrives").then(res => setStats(prev => ({ ...prev, testDrives: res.data.length }))).catch(() => {}),
      api.get("/bookings").then(res => setStats(prev => ({ ...prev, bookings: res.data.length }))).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const statItems = [
    { label: "Leads", value: stats.leads, Icon: Users, bg: "bg-blue-50 dark:bg-blue-900/20", color: "text-[#0071e3]" },
    { label: "Test Drives", value: stats.testDrives, Icon: Car, bg: "bg-purple-50 dark:bg-purple-900/20", color: "text-purple-600" },
    { label: "Bookings", value: stats.bookings, Icon: CalendarCheck, bg: "bg-green-50 dark:bg-green-900/20", color: "text-[#34c759]" }
  ];

  return (
    <EmployeeLayout>
      <div className="flex justify-center px-2 sm:px-0">
        {loading ? (
          <SkeletonProfile />
        ) : (
          <div className="w-full max-w-xl space-y-4">

            <h1 className="apple-title text-center">My Profile</h1>

            <div className="apple-card p-5 sm:p-6 space-y-4">
              <h2 className="apple-label">Employee Details</h2>
              <div className="space-y-3">
                {[
                  { label: "Name", value: profile.name },
                  { label: "Email", value: profile.email },
                  { label: "Phone", value: profile.phone },
                  { label: "Role", value: profile.role }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#e5e5ea] dark:border-[#2c2c2e] last:border-0">
                    <span className="apple-subtitle text-sm">{label}</span>
                    <span className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="apple-card p-5 sm:p-6 space-y-4">
              <h2 className="apple-label">Dealer Information</h2>
              <div className="space-y-3">
                {[
                  { label: "Dealer", value: profile.dealerName },
                  { label: "City", value: profile.dealerCity },
                  { label: "State", value: profile.dealerState }
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#e5e5ea] dark:border-[#2c2c2e] last:border-0">
                    <span className="apple-subtitle text-sm">{label}</span>
                    <span className="text-sm font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">{value || "—"}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="apple-card p-5 sm:p-6 space-y-4">
              <h2 className="apple-label">Performance Summary</h2>
              <div className="grid grid-cols-3 gap-3">
                {statItems.map(({ label, value, Icon, bg, color }) => (
                  <div key={label} className={`${bg} rounded-2xl p-4 flex flex-col items-center gap-2`}>
                    <div className={`${color}`}><Icon size={20} /></div>
                    <p className={`text-2xl font-semibold tracking-tight ${color}`}>{value}</p>
                    <p className="apple-label text-center">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
