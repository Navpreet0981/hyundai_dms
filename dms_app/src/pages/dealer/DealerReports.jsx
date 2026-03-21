import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";

export default function DealerReports() {
  const [leads, setLeads] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/customers").then(res => setLeads(res.data)).catch(() => {}),
      api.get("/testdrives").then(res => setTestDrives(res.data)).catch(() => {}),
      api.get("/bookings").then(res => setBookings(res.data)).catch(() => {}),
      api.get("/dealer/revenue/monthly").then(res => setMonthly(res.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const stats = [
    { name: "Leads", value: leads.length },
    { name: "Test Drives", value: testDrives.length },
    { name: "Bookings", value: bookings.length }
  ];
  const COLORS = ["#3B82F6", "#8B5CF6", "#10B981"];

  return (
    <DealerLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Dealer Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dealership performance analytics</p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              {[
                { label: "Leads", value: leads.length, color: "text-blue-600" },
                { label: "Test Drives", value: testDrives.length, color: "text-purple-600" },
                { label: "Bookings", value: bookings.length, color: "text-green-600" }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className={`text-2xl sm:text-3xl font-semibold mt-2 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? (
            <>
              <SkeletonChart />
              <SkeletonChart />
            </>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Bookings</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthly}>
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="totalBookings" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Conversion Breakdown</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={stats} dataKey="value" nameKey="name" outerRadius={80} label>
                      {stats.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

      </div>
    </DealerLayout>
  );
}
