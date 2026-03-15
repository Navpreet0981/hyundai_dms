import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function Bookings(){

const [bookings,setBookings] = useState([]);

const loadBookings = ()=>{
  api.get("/bookings")
  .then(res=>setBookings(res.data))
  .catch(err=>console.log(err));
};

useEffect(()=>{
  loadBookings();
},[]);

const updateStatus = (id,status)=>{
  api.put(`/bookings/${id}/status?status=${status}`)
     .then(()=>loadBookings())
     .catch(err=>console.log(err));
};

return(

<EmployeeLayout>

<div className="space-y-6">

<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
Bookings
</h2>

{/* TABLE CARD */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">

<tr>

<th className="p-4 text-left">Customer</th>
<th className="p-4 text-left">Variant</th>
<th className="p-4 text-left">Dealer</th>
<th className="p-4 text-left">Employee</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-left">Status</th>
<th className="p-4 text-left">Actions</th>

</tr>

</thead>

<tbody>

{bookings.map(b => (

<tr
key={b.bookingId}
className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
>

<td className="p-4 text-gray-800 dark:text-gray-200">
{b.customerName}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{b.variantName}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{b.dealerName}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{b.employeeName}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{b.bookingDate}
</td>

<td className="p-4">

<span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
{b.status}
</span>

</td>

<td className="p-4">

<div className="flex flex-wrap gap-2">

<button
className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
onClick={()=>updateStatus(b.bookingId,"CONFIRMED")}
>
Confirm
</button>

<button
className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
onClick={()=>updateStatus(b.bookingId,"DELIVERED")}
>
Deliver
</button>

<button
className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
onClick={()=>updateStatus(b.bookingId,"CANCELLED")}
>
Cancel
</button>

</div>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</EmployeeLayout>

);

}