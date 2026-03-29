import EmployeeLayout from "../../layouts/EmployeeLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";
import { useEmployeeLeads, useAllTestDrives, useAllBookings } from "../../hooks/useQueries";

// Color palette for pie chart slices
const COLORS = ["#0071e3", "#8b5cf6", "#34c759"];

export default function Reports() {
  // All three queries fire in parallel — each scoped to this employee by backend
  const { data: leads = [],      isLoading: l1 } = useEmployeeLeads();
  const { data: testDrives = [], isLoading: l2 } = useAllTestDrives();
  const { data: bookings = [],   isLoading: l3 } = useAllBookings();

  // Combined loading — all three must resolve before skeletons disappear
  const loading = l1 || l2 || l3;

  // KPI card config — values are array lengths from fetched data
  const kpiItems = [
    { label: "Leads Handled", value: leads.length,      color: "text-[#0071e3]" },
    { label: "Test Drives",   value: testDrives.length, color: "text-purple-600" },
    { label: "Bookings",      value: bookings.length,   color: "text-[#34c759]" },
  ];

  // Chart data — same values used for both bar chart and pie chart
  const chartData = [
    { name: "Leads",       count: leads.length },
    { name: "Test Drives", count: testDrives.length },
    { name: "Bookings",    count: bookings.length },
  ];

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="apple-title">Sales Reports</h1>
          <p className="apple-subtitle mt-1">Employee performance analytics</p>
        </div>

        {/* KPI cards — 3 skeletons while loading */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : kpiItems.map((item, i) => (
            <div key={i} className="apple-card p-5 sm:p-6 h-28 flex flex-col justify-center">
              <p className="apple-label">{item.label}</p>
              <p className={`text-3xl font-semibold tracking-tight mt-1 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Charts — bar chart for activity overview, pie for conversion breakdown */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? <><SkeletonChart /><SkeletonChart /></> : (
            <>
              {/* Bar chart: leads vs test drives vs bookings side by side */}
              <div className="apple-card p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Activity Overview</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="count" fill="#0071e3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie chart: same data as bar chart — shows proportional breakdown */}
              <div className="apple-card p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Conversion Breakdown</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={chartData} dataKey="count" nameKey="name" outerRadius={80} label>
                      {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
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
