import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
PieChart,
Pie,
Cell,
ResponsiveContainer
} from "recharts";

export default function AdminAnalytics(){

const [monthlySales,setMonthlySales] = useState([]);
const [leadSources,setLeadSources] = useState([]);
const [conversion,setConversion] = useState({});
const [dealerPerformance,setDealerPerformance] = useState([]);

useEffect(()=>{

api.get("/admin/sales/monthly")
.then(res=>setMonthlySales(res.data))
.catch(err=>console.log(err));

api.get("/admin/lead-source-analytics")
.then(res=>setLeadSources(res.data))
.catch(err=>console.log(err));

api.get("/admin/lead-conversion")
.then(res=>setConversion(res.data))
.catch(err=>console.log(err));

api.get("/admin/dealer-performance")
.then(res=>setDealerPerformance(res.data))
.catch(err=>console.log(err));

},[]);

const COLORS = ["#002c5f","#0ea5e9","#22c55e","#f97316"];

return(

<AdminLayout>

<div className="max-w-7xl mx-auto space-y-6">

<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
Analytics Dashboard
</h2>


{/* TOP CHARTS */}

<div className="grid xl:grid-cols-2 grid-cols-1 gap-6">

{/* Monthly Sales Chart */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<h3 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">
Monthly Sales
</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={monthlySales}>
<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="period"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="totalBookings" fill="#002c5f"/>
</BarChart>

</ResponsiveContainer>

</div>


{/* Lead Source Pie */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<h3 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">
Lead Sources
</h3>

<ResponsiveContainer width="100%" height={300}>

<PieChart>

<Pie
data={leadSources}
dataKey="count"
nameKey="source"
outerRadius={110}
label
>

{leadSources.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

</div>


{/* LEAD CONVERSION */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
Lead Conversion
</h3>

<div className="grid grid-cols-3 gap-6 text-center">

<div>
<p className="text-sm text-gray-500">Total Leads</p>
<p className="text-xl font-bold text-blue-600">
{conversion.totalLeads || 0}
</p>
</div>

<div>
<p className="text-sm text-gray-500">Test Drives</p>
<p className="text-xl font-bold text-purple-600">
{conversion.testDrives || 0}
</p>
</div>

<div>
<p className="text-sm text-gray-500">Bookings</p>
<p className="text-xl font-bold text-green-600">
{conversion.bookings || 0}
</p>
</div>

</div>

</div>


{/* DEALER PERFORMANCE */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">

<h3 className="mb-4 font-semibold text-gray-700 dark:text-gray-200">
Dealer Performance
</h3>

<table className="w-full text-left">

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

{dealerPerformance.map((d,i)=>(

<tr
key={i}
className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800"
>

<td className="p-3 font-medium text-gray-800 dark:text-gray-200">
{d.dealerName}
</td>

<td className="p-3 text-gray-600 dark:text-gray-300">
{d.totalEmployees}
</td>

<td className="p-3 text-gray-600 dark:text-gray-300">
{d.totalLeads}
</td>

<td className="p-3 text-gray-600 dark:text-gray-300">
{d.totalBookings}
</td>

<td className="p-3 font-semibold text-blue-600">
{d.conversionRate}%
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</AdminLayout>

)

}