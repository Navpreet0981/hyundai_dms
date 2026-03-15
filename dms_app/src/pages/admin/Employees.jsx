import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, Trash2 } from "lucide-react";

export default function Employees(){

  const [employees,setEmployees] = useState([]);

  const loadEmployees = () => {
    api.get("/employees")
      .then(res => setEmployees(res.data))
      .catch(err => console.log(err));
  };

  useEffect(()=>{
    loadEmployees();
  },[]);

  const deleteEmployee = (id) => {
    api.delete(`/employees/${id}`)
      .then(()=>loadEmployees())
      .catch(err=>console.log(err));
  };

  return(

    <AdminLayout>

      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Employees
          </h1>

          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <PlusCircle size={18}/>
            Add Employee
          </button>

        </div>


        {/* TABLE */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">

          <table className="w-full text-left">

            <thead className="border-b border-gray-200 dark:border-slate-800">

              <tr className="text-gray-600 dark:text-gray-300 text-sm">

                <th className="p-4">Employee</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Dealer</th>
                <th className="p-4">City</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>

              </tr>

            </thead>


            <tbody>

              {employees.map((e)=>(

                <tr
                  key={e.employeeId}
                  className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >

                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                    {e.name}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {e.phone}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {e.email}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {e.dealerName || "—"}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {e.dealerCity || "—"}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {e.role}
                  </td>


                  {/* ACTIONS */}

                  <td className="p-4">

                    <button
                      onClick={()=>deleteEmployee(e.employeeId)}
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

    </AdminLayout>

  )

}