import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Users, Car, CalendarCheck, Wrench } from "lucide-react";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";

export default function EmployeeDashboard() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/employee/dashboard").then(res => setData(res.data)).catch(() => {}),
      api.get("/employee/sales/monthly").then(res => setChartData(res.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const pieData = [
    { name: "Test Drives", value: data.testDrives || 0 },
    { name: "Bookings", value: data.bookings || 0 }
  ];
  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <EmployeeLayout>
      <div className="space-y-6 sm:space-y-8">

        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Employee Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
            <>
              {[
                { label: "Total Leads", value: data.totalLeads || 0, color: "text-blue-600", Icon: Users, iconColor: "text-blue-500" },
                { label: "Test Drives", value: data.testDrives || 0, color: "text-purple-600", Icon: Car, iconColor: "text-purple-500" },
                { label: "Bookings", value: data.bookings || 0, color: "text-green-600", Icon: CalendarCheck, iconColor: "text-green-500" },
                { label: "Service Requests", value: data.services || 0, color: "text-yellow-500", Icon: Wrench, iconColor: "text-yellow-500" }
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
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">Monthly Sales</h2>
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
                <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 sm:mb-6">Conversion</h2>
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
    </EmployeeLayout>
  );
}
