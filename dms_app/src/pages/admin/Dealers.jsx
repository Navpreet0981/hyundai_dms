import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, Trash2, X } from "lucide-react";

export default function Dealers(){

const [dealers,setDealers] = useState([]);
const [showModal,setShowModal] = useState(false);

const [form,setForm] = useState({
dealerName:"",
email:"",
phone:"",
city:"",
state:"",
address:""
});


/* LOAD DEALERS */

const loadDealers = () => {

api.get("/dealers")
.then(res=>setDealers(res.data))
.catch(err=>console.log(err));

};

useEffect(()=>{

loadDealers();

},[]);


/* HANDLE INPUT */

const handleChange = (e) => {

setForm({...form,[e.target.name]:e.target.value});

};


/* ADD DEALER */

const addDealer = () => {

api.post("/dealers",form)
.then(()=>{

setShowModal(false);

setForm({
dealerName:"",
email:"",
phone:"",
city:"",
state:"",
address:""
});

loadDealers();

})
.catch(err=>console.log(err));

};


/* DELETE DEALER */

const deleteDealer = (id) => {

api.delete(`/dealers/${id}`)
.then(()=>loadDealers())
.catch(err=>console.log(err));

};


return(

<AdminLayout>

<div className="max-w-7xl mx-auto space-y-6">


{/* HEADER */}

<div className="flex justify-between items-center">

<h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
Dealers
</h1>

<button
onClick={()=>setShowModal(true)}
className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
>
<PlusCircle size={18}/>
Add Dealer
</button>

</div>



{/* TABLE */}

<div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">

<table className="w-full text-left">

<thead className="border-b border-gray-200 dark:border-slate-800">

<tr className="text-gray-600 dark:text-gray-300 text-sm">

<th className="p-4">Dealer Name</th>
<th className="p-4">Phone</th>
<th className="p-4">Email</th>
<th className="p-4">City</th>
<th className="p-4">Status</th>
<th className="p-4">Actions</th>

</tr>

</thead>


<tbody>

{dealers.map((dealer)=>(

<tr
key={dealer.dealerId}
className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
>

<td className="p-4 font-medium text-gray-800 dark:text-gray-200">
{dealer.dealerName}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{dealer.phone}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{dealer.email}
</td>

<td className="p-4 text-gray-600 dark:text-gray-300">
{dealer.city}
</td>


<td className="p-4">

{dealer.active ? (

<span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
ACTIVE
</span>

) : (

<span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
INACTIVE
</span>

)}

</td>


<td className="p-4">

<button
onClick={()=>deleteDealer(dealer.dealerId)}
className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
>

<Trash2 size={16}/>
Delete

</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>



{/* ADD DEALER MODAL */}

{showModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-[420px] p-6 space-y-4">


<div className="flex justify-between items-center">

<h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
Add Dealer
</h2>

<button onClick={()=>setShowModal(false)}>
<X size={18}/>
</button>

</div>


<input
name="dealerName"
placeholder="Dealer Name"
value={form.dealerName}
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2"
/>


<input
name="email"
placeholder="Email"
value={form.email}
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2"
/>


<input
name="phone"
placeholder="Phone"
value={form.phone}
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2"
/>


<input
name="city"
placeholder="City"
value={form.city}
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2"
/>


<input
name="state"
placeholder="State"
value={form.state}
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2"
/>


<input
name="address"
placeholder="Address"
value={form.address}
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2"
/>


<button
onClick={addDealer}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
>
Create Dealer
</button>


</div>

</div>

)}

</AdminLayout>

);

}