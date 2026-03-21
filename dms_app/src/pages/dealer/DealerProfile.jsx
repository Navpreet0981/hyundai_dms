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

  return (
    <DealerLayout>
      <div className="flex justify-center px-2 sm:px-0">
        {loading ? (
          <SkeletonProfile />
        ) : (
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6 space-y-6">

            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">Dealer Profile</h1>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Dealership Details</h2>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p><b>Name:</b> {profile.dealerName || "—"}</p>
                <p><b>Email:</b> {profile.email || "—"}</p>
                <p><b>Phone:</b> {profile.phone || "—"}</p>
                <p><b>City:</b> {profile.city || "—"}</p>
                <p><b>State:</b> {profile.state || "—"}</p>
                <p><b>Address:</b> {profile.address || "—"}</p>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Account Status</h2>
              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${profile.active ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"}`}>
                {profile.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Performance Summary</h2>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-center p-3 sm:p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Employees</p>
                  <p className="text-lg font-semibold text-blue-600">{stats.employees}</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 text-center p-3 sm:p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Leads</p>
                  <p className="text-lg font-semibold text-purple-600">{stats.leads}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-center p-3 sm:p-4 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Bookings</p>
                  <p className="text-lg font-semibold text-green-600">{stats.bookings}</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </DealerLayout>
  );
}
