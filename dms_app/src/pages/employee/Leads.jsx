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
                        <button className="apple-btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => updateStatus(l.customerId, "CONTACTED")}>Mark Contacted</button>
                        <button className="apple-btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => updateStatus(l.customerId, "VISITED_SHOWROOM")}>Visited Showroom</button>
                        <button className="apple-btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => updateStatus(l.customerId, "TEST_DRIVE_SCHEDULED")}>Test Drive Done</button>
                        <button className="apple-btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => updateStatus(l.customerId, "BOOKED")}>Mark Booked</button>
                        <button className="px-3 py-1.5 text-xs text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" onClick={() => updateStatus(l.customerId, "LOST")}>Mark Lost</button>
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
