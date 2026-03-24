import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { SkeletonCard, SkeletonChart } from "../../components/Skeleton";

const COLORS = ["#0071e3", "#bf5af2", "#30d158"];

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

  const kpis = [
    { label: "Leads",      value: leads.length,      color: "#0071e3", bg: "bg-[#0071e3]/10" },
    { label: "Test Drives",value: testDrives.length,  color: "#bf5af2", bg: "bg-[#bf5af2]/10" },
    { label: "Bookings",   value: bookings.length,    color: "#30d158", bg: "bg-[#30d158]/10" },
  ];

  const pieData = kpis.map(k => ({ name: k.label, value: k.value }));

  return (
    <DealerLayout>
      <div className="space-y-5">
        <div>
          <h1 className="apple-title">Dealer Reports</h1>
          <p className="apple-subtitle mt-1">Dealership performance analytics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {loading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : kpis.map((k, i) => (
            <div key={i} className="apple-card p-5 sm:p-6 h-28 flex justify-between items-center hover:shadow-apple transition-shadow">
              <div>
                <p className="text-xs text-[#86868b] font-medium mb-1">{k.label}</p>
                <p className="text-3xl font-semibold tracking-tight" style={{ color: k.color }}>{k.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-2xl ${k.bg}`} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {loading ? <><SkeletonChart /><SkeletonChart /></> : (
            <>
              <div className="apple-card p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Monthly Bookings</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthly}>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", fontSize: 12 }} />
                    <Bar dataKey="totalBookings" fill="#0071e3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="apple-card p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Conversion Breakdown</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={45} paddingAngle={3} label>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
