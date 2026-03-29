import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";
import { useAdminMonthlySales, useAdminDealerSales, useAdminSalesSummary } from "../../hooks/useQueries";

// Builds KPI card config from stats object — function so it always uses latest stats data
const KPI_ITEMS = (stats) => [
  { label: "Total Bookings", value: stats.totalBookings || 0,                        valueColor: "text-blue-600",   color: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Total Revenue",  value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, valueColor: "text-green-600",  color: "bg-green-50 dark:bg-green-900/20" },
  { label: "Test Drives",    value: stats.totalTestDrives || 0,                      valueColor: "text-purple-600", color: "bg-purple-50 dark:bg-purple-900/20" },
  { label: "Conversion Rate",value: `${stats.conversionRate || 0}%`,                 valueColor: "text-orange-500", color: "bg-orange-50 dark:bg-orange-900/20" },
];

export default function SalesAnalytics() {
  // Monthly booking counts for bar chart — reuses same cache key as AdminDashboard
  const { data: monthly = [],     isLoading: l1 } = useAdminMonthlySales();

  // Booking count per dealer for the second bar chart
  const { data: dealerSales = [], isLoading: l2 } = useAdminDealerSales();

  // Summary stats: total bookings, revenue, test drives, conversion rate
  const { data: stats = {},       isLoading: l3 } = useAdminSalesSummary();

  // Combined loading — all three must resolve before skeletons disappear
  const loading = l1 || l2 || l3;

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="apple-title">Sales Analytics</h1>
          <p className="apple-subtitle mt-1">Revenue and booking performance overview</p>
        </div>

        {/* KPI cards — 4 skeleton cards while loading, then real values from stats */}
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

        {/* Two bar charts side by side — monthly sales and per-dealer sales */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? <><SkeletonChart /><SkeletonChart /></> : (
            <>
              {/* Bar chart: booking count per month — dataKey matches backend SalesAnalyticsDTO.totalBookings */}
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

              {/* Bar chart: booking count per dealer — dataKey matches backend Map key "bookings" */}
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
