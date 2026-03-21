import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useNavigate } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";

// Shared button styles
const btnPrimary = "px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors";
const btnDanger = "px-3 py-1 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors";

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = () => {
    api.get("/customers")
      .then(res => setLeads(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadLeads(); }, []);

  const scheduleTestDrive = (customer) => navigate("/testdrives", { state: { customer } });

  const updateStatus = (id, status) => {
    api.put(`/customers/${id}/status?status=${status}`)
      .then(() => loadLeads())
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Customer Leads</h2>

        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-4 text-left font-medium">Name</th>
                  <th className="p-4 text-left font-medium">Phone</th>
                  <th className="p-4 text-left font-medium">City</th>
                  <th className="p-4 text-left font-medium">Source</th>
                  <th className="p-4 text-left font-medium">Model</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-6 text-gray-400">No leads found</td></tr>
                ) : leads.map(l => (
                  <tr key={l.customerId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{l.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{l.phone}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{l.city}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{l.leadSource}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{l.interestedModel}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {l.leadStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => scheduleTestDrive(l)}>Schedule Test Drive</button>
                        <button className={btnOutline} onClick={() => updateStatus(l.customerId, "CONTACTED")}>Mark Contacted</button>
                        <button className={btnOutline} onClick={() => updateStatus(l.customerId, "VISITED_SHOWROOM")}>Visited Showroom</button>
                        <button className={btnOutline} onClick={() => updateStatus(l.customerId, "TEST_DRIVE_SCHEDULED")}>Test Drive Done</button>
                        <button className={btnOutline} onClick={() => updateStatus(l.customerId, "BOOKED")}>Mark Booked</button>
                        <button className={btnDanger} onClick={() => updateStatus(l.customerId, "LOST")}>Mark Lost</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}
