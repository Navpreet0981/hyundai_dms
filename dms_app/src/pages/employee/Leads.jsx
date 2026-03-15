import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useNavigate } from "react-router-dom";

export default function Leads() {

  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);

  const loadLeads = () => {
    api.get("/customers")
      .then(res => setLeads(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const scheduleTestDrive = (customer) => {
    navigate("/testdrives", { state: { customer } });
  };

  const updateStatus = (id, status) => {
    api.put(`/customers/${id}/status?status=${status}`)
      .then(() => loadLeads())
      .catch(err => console.log(err));
  };

  return (

    <EmployeeLayout>

      <div className="space-y-6">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Customer Leads
        </h2>

        {/* TABLE CARD */}

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300">

              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">City</th>
                <th className="p-4 text-left">Lead Source</th>
                <th className="p-4 text-left">Model</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>

            </thead>

            <tbody>

              {leads.map(l => (

                <tr
                  key={l.customerId}
                  className="border-t border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >

                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                    {l.name}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {l.phone}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {l.email}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {l.city}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {l.leadSource}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {l.interestedModel}
                  </td>

                  {/* STATUS */}

                  <td className="p-4">

                    <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      {l.leadStatus}
                    </span>

                  </td>

                  {/* ACTIONS */}

                  <td className="p-4">

                    <div className="flex flex-wrap gap-2">

                      <button
                        className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                        onClick={() => scheduleTestDrive(l)}
                      >
                        Schedule TD
                      </button>

                      <button
                        className="px-3 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                        onClick={() => updateStatus(l.customerId, "CONTACTED")}
                      >
                        Contacted
                      </button>

                      <button
                        className="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded"
                        onClick={() => updateStatus(l.customerId, "VISITED_SHOWROOM")}
                      >
                        Visited
                      </button>

                      <button
                        className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
                        onClick={() => updateStatus(l.customerId, "TEST_DRIVE_SCHEDULED")}
                      >
                        Test Drive
                      </button>

                      <button
                        className="px-3 py-1 text-xs bg-green-700 hover:bg-green-800 text-white rounded"
                        onClick={() => updateStatus(l.customerId, "BOOKED")}
                      >
                        Booked
                      </button>

                      <button
                        className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                        onClick={() => updateStatus(l.customerId, "LOST")}
                      >
                        Lost
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