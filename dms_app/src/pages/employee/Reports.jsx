import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";

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

export default function Reports(){

const [leads,setLeads] = useState([]);
const [testDrives,setTestDrives] = useState([]);
const [bookings,setBookings] = useState([]);

useEffect(()=>{

api.get("/customers").then(res=>setLeads(res.data));
api.get("/testdrives").then(res=>setTestDrives(res.data));
api.get("/bookings").then(res=>setBookings(res.data));

},[]);

const stats = [
{ name:"Leads", value:leads.length },
{ name:"Test Drives", value:testDrives.length },
{ name:"Bookings", value:bookings.length }
];

const COLORS = ["#3B82F6","#8B5CF6","#10B981"];

const chartData = [
{ name:"Leads", count:leads.length },
{ name:"Test Drives", count:testDrives.length },
{ name:"Bookings", count:bookings.length }
];

return(

<EmployeeLayout>

<div className="space-y-6">

<h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
Sales Reports
</h1>

<p className="text-sm text-gray-500 dark:text-gray-400">
Employee performance analytics
</p>


{/* KPI CARDS */}

<div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6">

<p className="text-sm text-gray-500 dark:text-gray-400">
Leads Handled
</p>

<p className="text-3xl font-semibold text-blue-600 mt-2">
{leads.length}
</p>

</div>


<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6">

<p className="text-sm text-gray-500 dark:text-gray-400">
Test Drives
</p>

<p className="text-3xl font-semibold text-purple-600 mt-2">
{testDrives.length}
</p>

</div>


<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6">

<p className="text-sm text-gray-500 dark:text-gray-400">
Bookings
</p>

<p className="text-3xl font-semibold text-green-600 mt-2">
{bookings.length}
</p>

</div>

</div>


{/* CHARTS */}

<div className="grid xl:grid-cols-2 grid-cols-1 gap-6">

{/* Activity Chart */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6">

<h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
Activity Overview
</h2>

<ResponsiveContainer width="100%" height={280}>

<BarChart data={chartData}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="count" fill="#3B82F6" radius={[6,6,0,0]} />

</BarChart>

</ResponsiveContainer>

</div>


{/* Conversion Chart */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6">

<h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
Conversion Breakdown
</h2>

<ResponsiveContainer width="100%" height={280}>

<PieChart>

<Pie
data={stats}
dataKey="value"
nameKey="name"
outerRadius={90}
label
>

{stats.map((entry,index)=>(
<Cell key={index} fill={COLORS[index % COLORS.length]}/>
))}

</Pie>

<Legend/>

</PieChart>

</ResponsiveContainer>

</div>

</div>

</div>

</EmployeeLayout>

);

}