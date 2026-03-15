import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function Profile(){

const [profile,setProfile] = useState({});
const [stats,setStats] = useState({
leads:0,
testDrives:0,
bookings:0
});

useEffect(()=>{

api.get("/employees/me")
.then(res=>{
setProfile(res.data);
})
.catch(err=>console.log(err));

api.get("/customers")
.then(res=>{
setStats(prev=>({...prev,leads:res.data.length}))
});

api.get("/testdrives")
.then(res=>{
setStats(prev=>({...prev,testDrives:res.data.length}))
});

api.get("/bookings")
.then(res=>{
setStats(prev=>({...prev,bookings:res.data.length}))
});

},[]);

return(

<EmployeeLayout>

<div className="flex justify-center">

<div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-6">

<h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
Profile
</h1>


{/* Employee Info */}

<div>

<h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
Employee Details
</h2>

<div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">

<p><b>Name:</b> {profile.name}</p>
<p><b>Email:</b> {profile.email}</p>
<p><b>Phone:</b> {profile.phone}</p>
<p><b>Role:</b> {profile.role}</p>

</div>

</div>


{/* Dealer Info */}

<div>

<h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
Dealer Information
</h2>

<div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">

<p><b>Dealer:</b> {profile.dealerName}</p>
<p><b>City:</b> {profile.dealerCity}</p>
<p><b>State:</b> {profile.dealerState}</p>

</div>

</div>


{/* Performance */}

<div>

<h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
Performance Summary
</h2>

<div className="grid grid-cols-3 gap-4">

<div className="bg-blue-100 dark:bg-blue-900/30 text-center p-4 rounded-lg">
<p className="text-xs text-gray-600 dark:text-gray-300">Leads</p>
<p className="text-lg font-semibold text-blue-600">{stats.leads}</p>
</div>

<div className="bg-purple-100 dark:bg-purple-900/30 text-center p-4 rounded-lg">
<p className="text-xs text-gray-600 dark:text-gray-300">Test Drives</p>
<p className="text-lg font-semibold text-purple-600">{stats.testDrives}</p>
</div>

<div className="bg-green-100 dark:bg-green-900/30 text-center p-4 rounded-lg">
<p className="text-xs text-gray-600 dark:text-gray-300">Bookings</p>
<p className="text-lg font-semibold text-green-600">{stats.bookings}</p>
</div>

</div>

</div>

</div>

</div>

</EmployeeLayout>

);
}