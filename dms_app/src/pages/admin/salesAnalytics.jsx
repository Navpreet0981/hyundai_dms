import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";

const KPI_ITEMS = (stats) => [
  { label: "Total Bookings", value: stats.totalBookings || 0, color: "bg-blue-50 dark:bg-blue-900/20", iconColor: "text-blue-600", valueColor: "text-blue-600" },
  { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, color: "bg-green-50 dark:bg-green-900/20", iconColor: "text-green-600", valueColor: "text-green-600" },
  { label: "Test Drives", value: stats.totalTestDrives || 0, color: "bg-purple-50 dark:bg-purple-900/20", iconColor: "text-purple-600", valueColor: "text-purple-600" },
  { label: "Conversion Rate", value: `${stats.conversionRate || 0}%`, color: "bg-orange-50 dark:bg-orange-900/20", iconColor: "text-orange-500", valueColor: "text-orange-500" }
];

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

        <div>
          <h1 className="apple-title">Sales Analytics</h1>
          <p className="apple-subtitle mt-1">Revenue and booking performance overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : KPI_ITEMS(stats).map((item, i) => (
              <div key={i} className="apple-card p-5 sm:p-6 h-28 flex items-center justify-between">
                <div>
                  <p className="apple-label">{item.label}</p>
                  <p className={`text-3xl font-semibold tracking-tight mt-1 ${item.valueColor}`}>{item.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center`} />
              </div>
            ))
          }
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? (
            <><SkeletonChart /><SkeletonChart /></>
          ) : (
            <>
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 sm:mb-6">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={monthly}>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="totalBookings" fill="#0071e3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 sm:mb-6">Sales per Dealer</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={dealerSales}>
                    <XAxis dataKey="dealerName" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="bookings" fill="#34c759" radius={[6, 6, 0, 0]} />
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
