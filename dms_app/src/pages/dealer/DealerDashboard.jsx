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
  const COLORS = ["#0071e3", "#30d158"];

  return (
    <DealerLayout>
      <div className="space-y-6 sm:space-y-8">

        <h1 className="apple-title">Dealer Dashboard</h1>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            [
              { label: "Employees",   value: data.totalEmployees  || 0, Icon: Users,         color: "text-[#0071e3]", bg: "bg-[#0071e3]/10" },
              { label: "Total Leads", value: data.totalLeads      || 0, Icon: TrendingUp,    color: "text-[#30d158]", bg: "bg-[#30d158]/10" },
              { label: "Test Drives", value: data.totalTestDrives || 0, Icon: Car,           color: "text-[#ff9f0a]", bg: "bg-[#ff9f0a]/10" },
              { label: "Bookings",    value: data.totalBookings   || 0, Icon: CalendarCheck, color: "text-[#bf5af2]", bg: "bg-[#bf5af2]/10" },
            ].map(({ label, value, Icon, color, bg }, i) => (
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

        {/* CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {loading ? (
            <>
              <SkeletonChart />
              <SkeletonChart />
            </>
          ) : (
            <>
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-5">
                  Monthly Bookings
                </h2>
                <ResponsiveContainer width="100%" height="85%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", fontSize: 12 }} />
                    <Bar dataKey="totalBookings" fill="#0071e3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="apple-card p-5 sm:p-6 h-[300px] sm:h-[360px]">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-5">
                  Conversion Overview
                </h2>
                <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} paddingAngle={3} label>
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} />
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
