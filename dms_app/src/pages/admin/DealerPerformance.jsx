import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";

export default function DealerPerformance(){

const [dealers,setDealers] = useState([]);

useEffect(()=>{
loadDealers();
},[]);


const loadDealers = ()=>{
api.get("/admin/dealer-performance")
.then(res=>setDealers(res.data))
.catch(err=>console.log(err));
};


const toggleDealer = (id,active)=>{
api.put(`/dealers/${id}/status`,{
active: !active
})
.then(()=>loadDealers());
};


const deleteDealer = (id)=>{
if(window.confirm("Delete this dealer?")){
api.delete(`/dealers/${id}`)
.then(()=>loadDealers());
}
};


return(

<AdminLayout>

<div className="max-w-7xl mx-auto space-y-6">

<div className="flex justify-between items-center">

<h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
Dealer Performance
</h1>

</div>


<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">

<table className="w-full text-left">

<thead className="border-b border-gray-200 dark:border-slate-800">

<tr className="text-gray-600 dark:text-gray-300 text-sm">

<th className="p-4">Dealer</th>
<th className="p-4">Employees</th>
<th className="p-4">Leads</th>
<th className="p-4">Bookings</th>
<th className="p-4">Conversion</th>
<th className="p-4">Status</th>
<th className="p-4">Actions</th>

</tr>

</thead>

<tbody>

{dealers.map((dealer)=>(

<tr
key={dealer.dealerId}
className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800"
>

<td className="p-4 font-medium text-gray-800 dark:text-gray-200">
{dealer.dealerName}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{dealer.totalEmployees}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{dealer.totalLeads}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{dealer.totalBookings}
</td>

<td className="p-4 font-semibold text-blue-600">
{dealer.conversionRate}%
</td>

<td className="p-4">

<span className={`px-3 py-1 rounded-full text-xs font-semibold ${
dealer.active
? "bg-green-100 text-green-700"
: "bg-red-100 text-red-700"
}`}>

{dealer.active ? "Active" : "Inactive"}

</span>

</td>

<td className="p-4 flex gap-2">

<button
onClick={()=>toggleDealer(dealer.dealerId,dealer.active)}
className={`px-3 py-1 text-sm rounded text-white ${
dealer.active
? "bg-yellow-500 hover:bg-yellow-600"
: "bg-green-600 hover:bg-green-700"
}`}
>
{dealer.active ? "Deactivate" : "Activate"}
</button>

<button
onClick={()=>deleteDealer(dealer.dealerId)}
className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</AdminLayout>

);

}