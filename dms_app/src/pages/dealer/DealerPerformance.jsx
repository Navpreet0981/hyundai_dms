import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "../../components/Skeleton";

export default function DealerPerformance() {
  const [performance, setPerformance] = useState([]);
  const [summary, setSummary] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dealer/performance").then(res => setPerformance(res.data)).catch(() => {}),
      api.get("/dealer/dashboard").then(res => setSummary(res.data)).catch(() => {}),
      api.get("/dealer/revenue/monthly").then(res => setMonthlyRevenue(res.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <DealerLayout>
      <div className="space-y-6">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Performance</h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              {[
                { label: "Total Leads", value: summary.totalLeads || 0, color: "text-blue-600" },
                { label: "Test Drives", value: summary.totalTestDrives || 0, color: "text-purple-600" },
                { label: "Bookings", value: summary.totalBookings || 0, color: "text-green-600" },
                { label: "Revenue", value: `₹${summary.totalRevenue || 0}`, color: "text-yellow-500" }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className={`text-2xl sm:text-3xl font-bold mt-1 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* REVENUE CHART */}
        {loading ? <SkeletonChart /> : monthlyRevenue.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm h-[300px] sm:h-[350px]">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Revenue</h2>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* CONVERSION CHART */}
        {loading ? <SkeletonChart /> : performance.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm h-[300px] sm:h-[350px]">
            <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Employee Conversion Rate</h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="employeeName" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="conversionRate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* PERFORMANCE TABLE */}
        {loading ? <SkeletonTable rows={4} cols={5} /> : performance.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="p-4 text-left">Employee</th>
                  <th className="p-4 text-left">Leads</th>
                  <th className="p-4 text-left">Test Drives</th>
                  <th className="p-4 text-left">Bookings</th>
                  <th className="p-4 text-left">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((e, i) => (
                  <tr key={i} className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{e.employeeName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{e.totalLeads}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{e.totalTestDrives}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{e.totalBookings}</td>
                    <td className="p-4 font-semibold text-blue-600">{e.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DealerLayout>
  );
}
