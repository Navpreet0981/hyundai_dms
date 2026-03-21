import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, Car, CalendarCheck, TrendingUp } from "lucide-react";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";

export default function DealerDashboard() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/dealer/dashboard").then(res => setData(res.data)),
      api.get("/dealer/revenue/monthly").then(res => setChartData(res.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: "Test Drives", value: data.totalTestDrives || 0 },
    { name: "Bookings", value: data.totalBookings || 0 }
  ];
  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <DealerLayout>
      <div className="space-y-6 sm:space-y-8">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Dealer Dashboard
        </h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">
                <div>
                  <p className="text-sm text-gray-500">Employees</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{data.totalEmployees || 0}</p>
                </div>
                <Users className="text-blue-500 shrink-0" size={28} />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">
                <div>
                  <p className="text-sm text-gray-500">Total Leads</p>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{data.totalLeads || 0}</p>
                </div>
                <TrendingUp className="text-purple-500 shrink-0" size={28} />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">
                <div>
                  <p className="text-sm text-gray-500">Test Drives</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{data.totalTestDrives || 0}</p>
                </div>
                <Car className="text-green-500 shrink-0" size={28} />
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">
                <div>
                  <p className="text-sm text-gray-500">Bookings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-500">{data.totalBookings || 0}</p>
                </div>
                <CalendarCheck className="text-yellow-500 shrink-0" size={28} />
              </div>
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
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">
                  Monthly Bookings
                </h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="totalBookings" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">
                  Conversion Overview
                </h2>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                      {pieData.map((_, index) => (
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
