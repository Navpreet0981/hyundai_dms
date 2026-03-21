import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Building2, Users, User, CalendarCheck } from "lucide-react";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";

export default function AdminDashboard() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/dashboard").then(res => setData(res.data)),
      api.get("/admin/sales/monthly").then(res => setChartData(res.data))
    ]).finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: "Dealers", value: data.totalDealers || 0 },
    { name: "Employees", value: data.totalEmployees || 0 }
  ];
  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              {[
                { label: "Dealers", value: data.totalDealers || 0, color: "text-blue-600", Icon: Building2, iconColor: "text-blue-500" },
                { label: "Employees", value: data.totalEmployees || 0, color: "text-purple-600", Icon: Users, iconColor: "text-purple-500" },
                { label: "Customers", value: data.totalCustomers || 0, color: "text-green-600", Icon: User, iconColor: "text-green-500" },
                { label: "Bookings", value: data.totalBookings || 0, color: "text-yellow-500", Icon: CalendarCheck, iconColor: "text-yellow-500" }
              ].map(({ label, value, color, Icon, iconColor }, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
                  </div>
                  <Icon className={`${iconColor} shrink-0`} size={28} />
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
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">Monthly Bookings</h2>
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
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">Organization Distribution</h2>
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
    </AdminLayout>
  );
}
