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

import { Users, Car, CalendarCheck, Wrench } from "lucide-react";

export default function EmployeeDashboard(){

const [data,setData] = useState({});
const [chartData,setChartData] = useState([]);

useEffect(()=>{

api.get("/employee/dashboard")
.then(res=>setData(res.data));

api.get("/employee/sales/monthly")
.then(res=>setChartData(res.data));

},[]);

const pieData = [
{name:"Test Drives",value:data.testDrives || 0},
{name:"Bookings",value:data.bookings || 0}
];

const COLORS = ["#3B82F6","#10B981"];

return(

<EmployeeLayout>

<div className="max-w-7xl mx-auto space-y-8">

<h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
Employee Dashboard
</h1>


{/* KPI CARDS */}

<div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">

{/* Leads */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

<div>
<p className="text-sm text-gray-500">Total Leads</p>
<p className="text-3xl font-bold text-blue-600">{data.totalLeads || 0}</p>
</div>

<Users className="text-blue-500" size={30}/>

</div>


{/* Test Drives */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

<div>
<p className="text-sm text-gray-500">Test Drives</p>
<p className="text-3xl font-bold text-purple-600">{data.testDrives || 0}</p>
</div>

<Car className="text-purple-500" size={30}/>

</div>


{/* Bookings */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

<div>
<p className="text-sm text-gray-500">Bookings</p>
<p className="text-3xl font-bold text-green-600">{data.bookings || 0}</p>
</div>

<CalendarCheck className="text-green-500" size={30}/>

</div>


{/* Services */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition flex justify-between items-center h-28">

<div>
<p className="text-sm text-gray-500">Service Requests</p>
<p className="text-3xl font-bold text-yellow-500">{data.services || 0}</p>
</div>

<Wrench className="text-yellow-500" size={30}/>

</div>

</div>


{/* CHARTS */}

<div className="grid xl:grid-cols-2 grid-cols-1 gap-6">


{/* SALES */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 h-[360px]">

<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
Monthly Sales
</h2>

<ResponsiveContainer width="100%" height="85%">

<BarChart data={chartData} margin={{top:10,right:20,left:0,bottom:5}}>

<XAxis dataKey="period"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="totalBookings" fill="#3B82F6" radius={[8,8,0,0]} />

</BarChart>

</ResponsiveContainer>

</div>


{/* CONVERSION */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 h-[360px]">

<h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-6">
Conversion
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

{pieData.map((entry,index)=>(
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