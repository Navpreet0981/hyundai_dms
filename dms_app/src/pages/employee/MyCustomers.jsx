import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function MyCustomers(){

const [customers,setCustomers] = useState([]);

useEffect(()=>{

api.get("/customers")
.then(res=>setCustomers(res.data))
.catch(err=>console.log(err));

},[]);

return(

<EmployeeLayout>

<div className="space-y-6">

<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
My Customers
</h2>

{/* TABLE CARD */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">

<tr>

<th className="p-4 text-left">Name</th>
<th className="p-4 text-left">Phone</th>
<th className="p-4 text-left">City</th>

</tr>

</thead>

<tbody>

{customers.map(c=>(

<tr
key={c.customerId}
className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
>

<td className="p-4 text-gray-800 dark:text-gray-200">
{c.name}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{c.phone}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{c.city}
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