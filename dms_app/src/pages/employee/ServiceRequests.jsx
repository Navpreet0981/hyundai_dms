import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { SkeletonTable } from "../../components/Skeleton";
import { useServiceRequests } from "../../hooks/useQueries";

export default function ServiceRequests() {
  const qc = useQueryClient();

  // Fetch all service requests assigned to this employee — backend scopes by JWT identity
  const { data: requests = [], isLoading: loading } = useServiceRequests();

  // Updates service request status then invalidates cache to refresh table
  const updateStatus = (id, status) => {
    api.put(`/service-requests/${id}/status?status=${status}`)
      .then(() => qc.invalidateQueries({ queryKey: ['service-requests'] }))
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <div>
          <h1 className="apple-title">Service Requests</h1>
          <p className="apple-subtitle mt-1">Manage customer service and repair requests</p>
        </div>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>{["Customer","Variant","Dealer","Issue","Date","Status","Actions"].map((h, i) => <th key={i} className="apple-table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 apple-subtitle">No service requests found</td></tr>
                ) : requests.map(r => (
                  <tr key={r.serviceRequestId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{r.customerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{r.variantName}</td>
                    <td className="apple-table-cell text-[#86868b]">{r.dealerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{r.issueDescription}</td>
                    <td className="apple-table-cell text-[#86868b]">{r.serviceDate}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-[#f5f5f7]">{r.status}</span>
                    </td>
                    {/* Two status transitions: OPEN → IN_PROGRESS → CLOSED */}
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <button className="apple-btn-primary !px-3 !py-1.5 !text-xs" onClick={() => updateStatus(r.serviceRequestId, "IN_PROGRESS")}>Start Service</button>
                        <button className="apple-btn-secondary !px-3 !py-1.5 !text-xs" onClick={() => updateStatus(r.serviceRequestId, "CLOSED")}>Mark Closed</button>
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
