import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

import { Building2, Users, User, CalendarCheck } from "lucide-react";

export default function AdminDashboard() {

  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {

    api.get("/admin/dashboard")
      .then(res => setData(res.data));

    api.get("/admin/sales/monthly")
      .then(res => setChartData(res.data));

  }, []);

  const pieData = [
    { name: "Dealers", value: data.totalDealers || 0 },
    { name: "Employees", value: data.totalEmployees || 0 }
  ];

  const COLORS = ["#3B82F6", "#10B981"];

  return (

    <AdminLayout>

      <div className="max-w-7xl mx-auto space-y-8">

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Admin Dashboard
        </h1>

        {/* KPI CARDS */}

        <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">

          {/* Dealers */}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

            <div>
              <p className="text-sm text-gray-500">Dealers</p>
              <p className="text-3xl font-bold text-blue-600">{data.totalDealers || 0}</p>
            </div>

            <Building2 className="text-blue-500" size={30} />

          </div>


          {/* Employees */}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

            <div>
              <p className="text-sm text-gray-500">Employees</p>
              <p className="text-3xl font-bold text-purple-600">{data.totalEmployees || 0}</p>
            </div>

            <Users className="text-purple-500" size={30} />

          </div>


          {/* Customers */}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <p className="text-3xl font-bold text-green-600">{data.totalCustomers || 0}</p>
            </div>

            <User className="text-green-500" size={30} />

          </div>


          {/* Bookings */}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

            <div>
              <p className="text-sm text-gray-500">Bookings</p>
              <p className="text-3xl font-bold text-yellow-500">{data.totalBookings || 0}</p>
            </div>

            <CalendarCheck className="text-yellow-500" size={30} />

          </div>

        </div>


        {/* CHARTS */}

        <div className="grid xl:grid-cols-2 grid-cols-1 gap-6">


          {/* SALES */}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 h-[360px]">

            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Monthly Bookings
            </h2>

            <ResponsiveContainer width="100%" height="85%">

              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>

                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />

                <Bar dataKey="totalBookings" fill="#3B82F6" radius={[8, 8, 0, 0]} />

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* DISTRIBUTION */}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 h-[360px]">

            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Organization Distribution
            </h2>

            <ResponsiveContainer width="100%" height="85%">

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >

                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}

                </Pie>

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </AdminLayout>

  );

}