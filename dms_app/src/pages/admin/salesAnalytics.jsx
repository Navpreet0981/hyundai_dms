import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

export default function SalesAnalytics(){

const [monthly,setMonthly] = useState([]);
const [dealerSales,setDealerSales] = useState([]);
const [stats,setStats] = useState({});

useEffect(()=>{

api.get("/admin/sales/monthly")
.then(res=>setMonthly(res.data))
.catch(err=>console.log(err));

api.get("/admin/sales/dealers")
.then(res=>setDealerSales(res.data))
.catch(err=>console.log(err));

api.get("/admin/sales/summary")
.then(res=>setStats(res.data))
.catch(err=>console.log(err));

},[]);

return(

<AdminLayout>

<div className="max-w-7xl mx-auto space-y-8">

<h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
Sales Analytics
</h1>


{/* KPI CARDS */}

<div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6">

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<p className="text-sm text-gray-500">Total Bookings</p>
<p className="text-3xl font-bold text-blue-600">
{stats.totalBookings || 0}
</p>

</div>

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<p className="text-sm text-gray-500">Total Revenue</p>
<p className="text-3xl font-bold text-green-600">
₹{stats.totalRevenue?.toLocaleString() || 0}
</p>

</div>

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<p className="text-sm text-gray-500">Test Drives</p>
<p className="text-3xl font-bold text-purple-600">
{stats.totalTestDrives || 0}
</p>

</div>

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<p className="text-sm text-gray-500">Conversion Rate</p>
<p className="text-3xl font-bold text-orange-500">
{stats.conversionRate || 0}%
</p>

</div>

</div>



{/* CHARTS */}

<div className="grid xl:grid-cols-2 grid-cols-1 gap-6">

{/* Monthly Sales */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 h-[360px]">

<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
Monthly Sales
</h2>

<ResponsiveContainer width="100%" height="85%">

<BarChart data={monthly}>

<XAxis dataKey="period"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="totalBookings" fill="#002c5f"/>

</BarChart>

</ResponsiveContainer>

</div>



{/* Dealer Sales */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 h-[360px]">

<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
Sales per Dealer
</h2>

<ResponsiveContainer width="100%" height="85%">

<BarChart data={dealerSales}>

<XAxis dataKey="dealerName"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="bookings" fill="#10B981"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

</div>

</AdminLayout>

)

}