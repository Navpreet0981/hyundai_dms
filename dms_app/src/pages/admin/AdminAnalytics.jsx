import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { SkeletonChart, SkeletonTable } from "../../components/Skeleton";

export default function AdminAnalytics() {
  const [monthlySales, setMonthlySales] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [conversion, setConversion] = useState({});
  const [dealerPerformance, setDealerPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/admin/sales/monthly").then(res => setMonthlySales(res.data)).catch(() => {}),
      api.get("/admin/lead-source-analytics").then(res => setLeadSources(res.data)).catch(() => {}),
      api.get("/admin/lead-conversion").then(res => setConversion(res.data)).catch(() => {}),
      api.get("/admin/dealer-performance").then(res => setDealerPerformance(res.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const COLORS = ["#002c5f", "#0ea5e9", "#22c55e", "#f97316"];

  return (
    <AdminLayout>
      <div className="space-y-6">

        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Analytics Dashboard</h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {loading ? (
            <>
              <SkeletonChart />
              <SkeletonChart />
            </>
          ) : (
            <>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="totalBookings" fill="#002c5f" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">Lead Sources</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={leadSources} dataKey="count" nameKey="source" outerRadius={100} label>
                      {leadSources.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {loading ? (
          <SkeletonTable rows={3} cols={3} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">Lead Conversion</h3>
            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
              {[
                { label: "Total Leads", value: conversion.totalLeads || 0, color: "text-blue-600" },
                { label: "Test Drives", value: conversion.testDrives || 0, color: "text-purple-600" },
                { label: "Bookings", value: conversion.bookings || 0, color: "text-green-600" }
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-xs sm:text-sm text-gray-500">{item.label}</p>
                  <p className={`text-lg sm:text-xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm overflow-x-auto">
            <h3 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">Dealer Performance</h3>
            <table className="w-full text-left min-w-[500px]">
              <thead className="border-b border-gray-200 dark:border-slate-800">
                <tr className="text-gray-600 dark:text-gray-300 text-sm">
                  <th className="p-3">Dealer</th>
                  <th className="p-3">Employees</th>
                  <th className="p-3">Leads</th>
                  <th className="p-3">Bookings</th>
                  <th className="p-3">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {dealerPerformance.map((d, i) => (
                  <tr key={i} className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{d.dealerName}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{d.totalEmployees}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{d.totalLeads}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{d.totalBookings}</td>
                    <td className="p-3 font-semibold text-blue-600">{d.conversionRate}%</td>
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
