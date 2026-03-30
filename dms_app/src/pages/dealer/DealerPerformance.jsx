import { useState } from "react";
import DealerLayout from "../../layouts/DealerLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "../../components/Skeleton";
import Pagination from "../../components/Pagination";
import { useDealerPerformance, useDealerDashboard, useDealerMonthlyRev } from "../../hooks/useQueries";

const COLORS = { leads: "#0071e3", drives: "#bf5af2", bookings: "#30d158", revenue: "#ff9f0a" };
const PAGE_SIZE = 10;

export default function DealerPerformance() {
  const { data: performance = [],    isLoading: l1 } = useDealerPerformance();
  const { data: summary = {},        isLoading: l2 } = useDealerDashboard();
  const { data: monthlyRevenue = [], isLoading: l3 } = useDealerMonthlyRev();
  const loading = l1 || l2 || l3;

  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(performance.length / PAGE_SIZE);
  const paged      = performance.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  // KPI card config built from summary data
  const kpis = [
    { label: "Total Leads",  value: summary.totalLeads     || 0,                        color: COLORS.leads,    bg: "bg-[#0071e3]/10" },
    { label: "Test Drives",  value: summary.totalTestDrives|| 0,                        color: COLORS.drives,   bg: "bg-[#bf5af2]/10" },
    { label: "Bookings",     value: summary.totalBookings  || 0,                        color: COLORS.bookings, bg: "bg-[#30d158]/10" },
    { label: "Revenue",      value: `₹${(summary.totalRevenue || 0).toLocaleString()}`, color: COLORS.revenue,  bg: "bg-[#ff9f0a]/10" },
  ];

  return (
    <DealerLayout>
      <div className="space-y-5">
        <h1 className="apple-title">Performance</h1>

        {/* KPI cards — 4 skeletons while loading */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : kpis.map((k, i) => (
            <div key={i} className="apple-card p-5 sm:p-6 h-28 flex justify-between items-center hover:shadow-apple transition-shadow">
              <div>
                <p className="text-xs text-[#86868b] font-medium mb-1">{k.label}</p>
                <p className="text-3xl font-semibold tracking-tight" style={{ color: k.color }}>{k.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-2xl ${k.bg} flex items-center justify-center`}>
                <div className="w-3 h-3 rounded-full" style={{ background: k.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts row — monthly revenue bar chart + employee conversion rate bar chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {loading ? <><SkeletonChart /><SkeletonChart /></> : (
            <>
              {/* Bar chart: monthly booking counts — Y axis formatted as ₹Xk */}
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[340px]">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Monthly Revenue</h2>
                {monthlyRevenue.length === 0 ? (
                  <div className="h-[85%] flex items-center justify-center text-sm text-[#86868b]">No revenue data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={monthlyRevenue}>
                      <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", fontSize: 12 }} formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#ff9f0a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Bar chart: per-employee conversion rate — only shown if performance data exists */}
              {performance.length > 0 && (
                <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[340px]">
                  <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Employee Conversion Rate</h2>
                  <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={performance}>
                      <XAxis dataKey="employeeName" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", fontSize: 12 }} />
                      <Bar dataKey="conversionRate" fill="#30d158" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </>
          )}
        </div>

        {/* Per-employee performance table with pagination */}
        {!loading && performance.length > 0 && (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>{["Employee","Leads","Test Drives","Bookings","Conversion"].map((h, i) => <th key={i} className="apple-table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {paged.map((e, i) => (
                  <tr key={i} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{e.employeeName}</td>
                    <td className="apple-table-cell text-[#86868b]">{e.totalLeads}</td>
                    <td className="apple-table-cell text-[#86868b]">{e.totalTestDrives}</td>
                    <td className="apple-table-cell text-[#86868b]">{e.totalBookings}</td>
                    <td className="apple-table-cell font-semibold text-[#0071e3]">{e.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}
        {/* Show skeleton table while loading */}
        {loading && <SkeletonTable rows={4} />}
      </div>
    </DealerLayout>
  );
}
