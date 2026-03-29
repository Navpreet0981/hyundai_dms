import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Building2, Users, User, CalendarCheck } from "lucide-react";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";
import { useAdminDashboard, useAdminMonthlySales } from "../../hooks/useQueries";

export default function AdminDashboard() {
  // Fetch system-wide counts (dealers, employees, customers, bookings) from /admin/dashboard
  const { data = {}, isLoading: l1 } = useAdminDashboard();

  // Fetch monthly booking data for the bar chart from /admin/sales/monthly
  const { data: chartData = [], isLoading: l2 } = useAdminMonthlySales();

  // Combined loading flag — skeletons show until both queries resolve
  const loading = l1 || l2;

  // Build pie chart data from dashboard counts — no extra API call needed
  const pieData = [
    { name: "Dealers",   value: data.totalDealers   || 0 },
    { name: "Employees", value: data.totalEmployees || 0 },
  ];
  const COLORS = ["#0071e3", "#30d158"];

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <h1 className="apple-title">Admin Dashboard</h1>

        {/* Stat cards — show 4 skeletons while loading, then render real values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            [
              { label: "Dealers",   value: data.totalDealers   || 0, color: "text-[#0071e3]", bg: "bg-[#0071e3]/10", Icon: Building2 },
              { label: "Employees", value: data.totalEmployees || 0, color: "text-[#bf5af2]", bg: "bg-[#bf5af2]/10", Icon: Users },
              { label: "Customers", value: data.totalCustomers || 0, color: "text-[#30d158]", bg: "bg-[#30d158]/10", Icon: User },
              { label: "Bookings",  value: data.totalBookings  || 0, color: "text-[#ff9f0a]", bg: "bg-[#ff9f0a]/10", Icon: CalendarCheck },
            ].map(({ label, value, color, bg, Icon }, i) => (
              <div key={i} className="apple-card p-5 sm:p-6 h-28 flex justify-between items-center hover:shadow-apple transition-shadow duration-200">
                <div>
                  <p className="text-xs text-[#86868b] font-medium mb-1">{label}</p>
                  <p className={`text-3xl font-semibold tracking-tight ${color}`}>{value}</p>
                </div>
                <div className={`w-11 h-11 rounded-2xl ${bg} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Charts — bar chart for monthly bookings, pie chart for org distribution */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {loading ? <><SkeletonChart /><SkeletonChart /></> : (
            <>
              {/* Bar chart: booking count per month */}
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-5">Monthly Bookings</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", fontSize: 12 }} />
                    <Bar dataKey="totalBookings" fill="#0071e3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart: dealers vs employees distribution */}
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-5">Organization Distribution</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} paddingAngle={3} label>
                      {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
