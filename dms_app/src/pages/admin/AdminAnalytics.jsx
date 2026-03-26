import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { SkeletonChart, SkeletonTable } from "../../components/Skeleton";
import { useAdminMonthlySales, useAdminLeadSources, useAdminLeadConv, useAdminDealerPerf } from "../../hooks/useQueries";

const COLORS = ["#0071e3", "#0ea5e9", "#34c759", "#ff9f0a"];

export default function AdminAnalytics() {
  const { data: monthlySales = [],      isLoading: l1 } = useAdminMonthlySales();
  const { data: leadSources = [],       isLoading: l2 } = useAdminLeadSources();
  const { data: conversion = {},        isLoading: l3 } = useAdminLeadConv();
  const { data: dealerPerformance = [], isLoading: l4 } = useAdminDealerPerf();
  const loading = l1 || l2 || l3 || l4;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="apple-title">Analytics Dashboard</h1>
          <p className="apple-subtitle mt-1">Lead conversion and dealer performance insights</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? <><SkeletonChart /><SkeletonChart /></> : (
            <>
              <div className="apple-card p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlySales}>
                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#86868b" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="totalBookings" fill="#0071e3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="apple-card p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Lead Sources</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={leadSources} dataKey="totalLeads" nameKey="source" outerRadius={100} label>
                      {leadSources.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e5ea", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {loading ? <SkeletonTable rows={3} /> : (
          <div className="apple-card p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-4">Lead Conversion</h3>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
              {[
                { label: "Total Leads",  value: conversion.totalLeads     || 0, color: "text-[#0071e3]" },
                { label: "Test Drives",  value: conversion.totalTestDrives || 0, color: "text-purple-600" },
                { label: "Bookings",     value: conversion.totalBookings   || 0, color: "text-[#34c759]" },
              ].map((item, i) => (
                <div key={i} className="apple-card p-4">
                  <p className="apple-label mb-1">{item.label}</p>
                  <p className={`text-2xl font-semibold tracking-tight ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <div className="p-5 sm:p-6 border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
              <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Dealer Performance</h3>
            </div>
            <table className="w-full text-left min-w-[500px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Dealer","Employees","Leads","Bookings","Conversion"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dealerPerformance.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 apple-subtitle">No data available</td></tr>
                ) : dealerPerformance.map((d, i) => (
                  <tr key={i} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{d.dealerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{d.totalEmployees}</td>
                    <td className="apple-table-cell text-[#86868b]">{d.totalLeads}</td>
                    <td className="apple-table-cell text-[#86868b]">{d.totalBookings}</td>
                    <td className="apple-table-cell font-semibold text-[#0071e3]">{d.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
