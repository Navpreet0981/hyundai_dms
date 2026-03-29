import EmployeeLayout from "../../layouts/EmployeeLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, Car, CalendarCheck, Wrench } from "lucide-react";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";
import { useEmployeeDashboard, useEmployeeMonthlySales } from "../../hooks/useQueries";

const COLORS = ["#0071e3", "#34c759"];

export default function EmployeeDashboard() {
  // Fetch employee-scoped stats: leads, test drives, bookings, service requests
  const { data = {},            isLoading: l1 } = useEmployeeDashboard();

  // Fetch monthly booking counts for the bar chart
  const { data: chartData = [], isLoading: l2 } = useEmployeeMonthlySales();

  // Combined loading — both queries must resolve before skeletons disappear
  const loading = l1 || l2;

  // KPI card config — each item maps to a stat from the dashboard response
  const kpiItems = [
    { label: "Total Leads",      value: data.totalLeads || 0, Icon: Users,         bg: "bg-blue-50 dark:bg-blue-900/20",    color: "text-[#0071e3]" },
    { label: "Test Drives",      value: data.testDrives || 0, Icon: Car,           bg: "bg-purple-50 dark:bg-purple-900/20", color: "text-purple-600" },
    { label: "Bookings",         value: data.bookings   || 0, Icon: CalendarCheck, bg: "bg-green-50 dark:bg-green-900/20",  color: "text-[#34c759]" },
    { label: "Service Requests", value: data.services   || 0, Icon: Wrench,        bg: "bg-orange-50 dark:bg-orange-900/20", color: "text-orange-500" },
  ];

  // Pie chart data built from dashboard stats — no extra API call needed
  const pieData = [
    { name: "Test Drives", value: data.testDrives || 0 },
    { name: "Bookings",    value: data.bookings   || 0 },
  ];

  return (
    <EmployeeLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="apple-title">Employee Dashboard</h1>
          <p className="apple-subtitle mt-1">Your activity and performance at a glance</p>
        </div>

        {/* KPI cards — 4 skeletons while loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : kpiItems.map(({ label, value, Icon, bg, color }, i) => (
            <div key={i} className="apple-card p-5 sm:p-6 h-28 flex items-center justify-between">
              <div>
                <p className="apple-label">{label}</p>
                <p className={`text-3xl font-semibold tracking-tight mt-1 ${color}`}>{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={20} className={color} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts — bar chart for monthly sales, pie for test drive vs booking conversion */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? <><SkeletonChart /><SkeletonChart /></> : (
            <>
              {/* Bar chart: booking count per month */}
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 sm:mb-6">Monthly Sales</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="totalBookings" fill="#0071e3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart: test drives vs bookings — shows conversion at a glance */}
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4 sm:mb-6">Conversion</h2>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </EmployeeLayout>
  );
}
