import { useState } from "react";
import api from "../../api/axiosClient";
import { User, Building2, Shield } from "lucide-react";

export default function LoginPage() {

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [role,setRole] = useState("ADMIN");
const [loading,setLoading] = useState(false);

const login = async () => {

try{

setLoading(true);

const res = await api.post("/auth/login",{
email,
password,
role
});

localStorage.setItem("token",res.data.token);
localStorage.setItem("role",role);

if(role==="ADMIN") window.location.href="/admin";
if(role==="DEALER") window.location.href="/dealer";
if(role==="EMPLOYEE") window.location.href="/leads";

}catch(err){

alert("Invalid Credentials")

}finally{
setLoading(false);
}

};

return(

<div className="flex min-h-screen">

{/* LEFT BRAND PANEL */}

<div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-slate-900 text-white p-12 relative">

{/* LOGO TOP LEFT */}

<img
src="/hmi_logo.png"
alt="Hyundai"
className="absolute top-6 left-6 w-32"
/>

<h1 className="text-4xl font-bold mb-4">
Hyundai DMS
</h1>

<p className="text-slate-300 text-center max-w-md">
Dealer Management System for managing leads, bookings,
test drives and service operations across dealerships.
</p>

<p className="text-sm text-slate-400 mt-8">
Hyundai Motor India
</p>

</div>


{/* RIGHT LOGIN PANEL */}

<div className="flex justify-center items-center w-full lg:w-1/2 bg-gray-100 dark:bg-slate-950">

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl rounded-xl p-10 w-[420px]">

<h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-6">
Login to DMS
</h2>


{/* ROLE BUTTONS */}

<div className="grid grid-cols-3 gap-3 mb-6">

<button
onClick={()=>setRole("ADMIN")}
className={`flex flex-col items-center justify-center p-3 rounded-lg border transition transform hover:scale-105
${role==="ADMIN"
?"bg-slate-900 text-white border-blue-600 shadow-lg"
:"border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
>
<Shield size={20}/>
<span className="text-xs mt-1">Admin</span>
</button>

<button
onClick={()=>setRole("DEALER")}
className={`flex flex-col items-center justify-center p-3 rounded-lg border transition transform hover:scale-105
${role==="DEALER"
?"bg-slate-900 text-white border-blue-600 shadow-lg"
:"border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
>
<Building2 size={20}/>
<span className="text-xs mt-1">Dealer</span>
</button>

<button
onClick={()=>setRole("EMPLOYEE")}
className={`flex flex-col items-center justify-center p-3 rounded-lg border transition transform hover:scale-105
${role==="EMPLOYEE"
?"bg-slate-900 text-white border-blue-600 shadow-lg"
:"border-gray-300 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"}`}
>
<User size={20}/>
<span className="text-xs mt-1">Employee</span>
</button>

</div>


{/* EMAIL */}

<input
className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>


{/* PASSWORD */}

<input
className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>


{/* LOGIN BUTTON */}

<button
onClick={login}
disabled={loading}
className="w-full bg-slate-900 hover:bg-slate-700 text-white py-3 rounded-lg font-medium flex justify-center items-center gap-2 transition"
>

{loading && (
<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
)}

{loading ? "Logging in..." : "Login"}

</button>


<p className="text-center text-xs text-gray-400 mt-6">
Hyundai Dealer Management System
</p>

</div>

</div>

</div>

);

}