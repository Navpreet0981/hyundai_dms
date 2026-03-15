import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useLocation } from "react-router-dom";

export default function TestDrives(){

const location = useLocation();
const selectedCustomer = location.state?.customer;

const [testDrives,setTestDrives] = useState([]);
const [date,setDate] = useState("");

const loadTestDrives = ()=>{
  api.get("/testdrives")
    .then(res=>setTestDrives(res.data))
    .catch(err=>console.log(err));
};

useEffect(()=>{
  loadTestDrives();
},[]);

const createTestDrive = ()=>{

  if(!date){
    alert("Please select date");
    return;
  }

  api.post("/testdrives",{
    customerId:selectedCustomer.customerId,
    dealerId:selectedCustomer.dealerId,
    employeeId:selectedCustomer.employeeId,
    variantId:1,
    testDriveDate:date,
    status:"REQUESTED"
  })
  .then(()=>{
    alert("Test Drive Scheduled");
    setDate("");
    loadTestDrives();
  })
  .catch(err=>console.log(err));

};

const updateStatus = (id,status)=>{
  api.put(`/testdrives/${id}/status?status=${status}`)
     .then(()=>loadTestDrives())
     .catch(err=>console.log(err));
};

const createBooking = (testDrive)=>{

  api.post("/bookings",{
    customerId:testDrive.customerId,
    dealerId:testDrive.dealerId,
    employeeId:testDrive.employeeId,
    variantId:testDrive.variantId,
    bookingDate:new Date().toISOString().split("T")[0],
    status:"PENDING"
  })
  .then(()=>{
    alert("Booking Created");
  })
  .catch(err=>console.log(err));

};

return(

<EmployeeLayout>

<div className="space-y-6">

<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
Test Drives
</h2>

{/* SCHEDULE CARD */}

{selectedCustomer && (

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 max-w-md">

<h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
Schedule Test Drive
</h3>

<div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-4">
<p><b>Customer:</b> {selectedCustomer.name}</p>
<p><b>Phone:</b> {selectedCustomer.phone}</p>
<p><b>Model:</b> {selectedCustomer.interestedModel}</p>
</div>

<div className="flex gap-3">

<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-2 rounded w-full"
/>

<button
className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
onClick={createTestDrive}
>
Create
</button>

</div>

</div>

)}


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

{testDrives.map(t => (

<tr
key={t.testDriveId}
className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800"
>

<td className="p-4 text-gray-800 dark:text-gray-200">{t.customerName}</td>
<td className="p-4 text-gray-600 dark:text-gray-300">{t.variantName}</td>
<td className="p-4 text-gray-600 dark:text-gray-300">{t.dealerName}</td>
<td className="p-4 text-gray-600 dark:text-gray-300">{t.employeeName}</td>
<td className="p-4 text-gray-600 dark:text-gray-300">{t.testDriveDate}</td>

<td className="p-4">

<span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
{t.status}
</span>

</td>

<td className="p-4">

<div className="flex flex-wrap gap-2">

<button
className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
onClick={()=>updateStatus(t.testDriveId,"CONFIRMED")}
>
Confirm
</button>

<button
className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
onClick={()=>updateStatus(t.testDriveId,"COMPLETED")}
>
Complete
</button>

<button
className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
onClick={()=>updateStatus(t.testDriveId,"CANCELLED")}
>
Cancel
</button>

{t.status === "COMPLETED" && (

<button
className="px-3 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded"
onClick={()=>createBooking(t)}
>
Create Booking
</button>

)}

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