import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useNavigate } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";
import { useEmployeeLeads } from "../../hooks/useQueries";

export default function Leads() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: leads = [], isLoading: loading } = useEmployeeLeads();

  const scheduleTestDrive = (customer) => navigate("/testdrives", { state: { customer } });

  const updateStatus = (id, status) => {
    api.put(`/customers/${id}/status?status=${status}`)
      .then(() => qc.invalidateQueries({ queryKey: ['employee-leads'] }))
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="apple-title">Customer Leads</h1>
          <p className="apple-subtitle mt-1">Track and manage your assigned leads</p>
        </div>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-sm min-w-[750px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Name","Phone","City","Source","Model","Status","Actions"].map((h, i) => <th key={i} className="apple-table-header">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 apple-subtitle">No leads found</td></tr>
                ) : leads.map(l => (
                  <tr key={l.customerId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{l.name}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.phone}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.city}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.leadSource}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.interestedModel}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]">{l.leadStatus}</span>
                    </td>
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <button className="apple-btn-primary !px-3 !py-1.5 !text-xs" onClick={() => scheduleTestDrive(l)}>Schedule Test Drive</button>
                        <select
                          defaultValue=""
                          onChange={e => { if (e.target.value) { updateStatus(l.customerId, e.target.value); e.target.value = ""; } }}
                          className="text-xs rounded-lg border border-[#e5e5ea] dark:border-[#3a3a3c]
                            bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]
                            px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
                        >
                          <option value="" disabled>Update Status…</option>
                          <option value="CONTACTED">Mark Contacted</option>
                          <option value="VISITED_SHOWROOM">Visited Showroom</option>
                          <option value="TEST_DRIVE_SCHEDULED">Test Drive Done</option>
                          <option value="BOOKED">Mark Booked</option>
                          <option value="LOST">Mark Lost</option>
                        </select>
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
