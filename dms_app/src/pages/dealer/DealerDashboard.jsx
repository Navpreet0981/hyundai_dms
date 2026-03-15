import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";

export default function DealerDashboard(){

const [data,setData] = useState({});

useEffect(()=>{

api.get("/dealer/dashboard/1")
.then(res=>setData(res.data));

},[]);

return(

<DealerLayout>

<h2 className="text-xl font-bold mb-4">Dealer Dashboard</h2>

<p>Total Employees: {data.totalEmployees}</p>
<p>Total Leads: {data.totalLeads}</p>
<p>Total Test Drives: {data.totalTestDrives}</p>
<p>Total Bookings: {data.totalBookings}</p>

</DealerLayout>

)

}