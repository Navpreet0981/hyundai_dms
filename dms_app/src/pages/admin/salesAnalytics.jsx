import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";

export default function SalesAnalytics() {
  const [monthly, setMonthly] = useState([]);
  const [dealerSales, setDealerSales] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/sales/monthly").then(res => setMonthly(res.data)).catch(() => {}),
      api.get("/admin/sales/dealers").then(res => setDealerSales(res.data)).catch(() => {}),
      api.get("/admin/sales/summary").then(res => setStats(res.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Sales Analytics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              {[
                { label: "Total Bookings", value: stats.totalBookings || 0, color: "text-blue-600" },
                { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, color: "text-green-600" },
                { label: "Test Drives", value: stats.totalTestDrives || 0, color: "text-purple-600" },
                { label: "Conversion Rate", value: `${stats.conversionRate || 0}%`, color: "text-orange-500" }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className={`text-2xl sm:text-3xl font-bold mt-1 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? (
            <>
              <SkeletonChart />
              <SkeletonChart />
            </>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={monthly}>
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="totalBookings" fill="#002c5f" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">Sales per Dealer</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={dealerSales}>
                    <XAxis dataKey="dealerName" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="bookings" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
