import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";

const btnPrimary = "px-3 py-1 text-xs bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-lg transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-lg transition-colors";
const btnDanger  = "px-3 py-1 text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors";

export default function DealerLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLeads = () => {
    api.get("/customers").then(res => setLeads(res.data)).catch(err => console.log(err)).finally(() => setLoading(false));
  };

  useEffect(() => { loadLeads(); }, []);

  const updateStatus = (id, status) => {
    api.put(`/customers/${id}/status?status=${status}`).then(() => loadLeads()).catch(err => console.log(err));
  };

  return (
    <DealerLayout>
      <div className="space-y-5">
        <h1 className="apple-title">Customer Leads</h1>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Name","Phone","City","Model","Employee","Status","Actions"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 text-[#86868b] text-sm">No leads found</td></tr>
                ) : leads.map(l => (
                  <tr key={l.customerId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{l.name}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.phone}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.city}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.interestedModel}</td>
                    <td className="apple-table-cell text-[#86868b]">{l.employeeName || "—"}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]">{l.leadStatus}</span>
                    </td>
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(l.customerId, "CONTACTED")}>Contacted</button>
                        <button className={btnOutline} onClick={() => updateStatus(l.customerId, "BOOKED")}>Booked</button>
                        <button className={btnDanger}  onClick={() => updateStatus(l.customerId, "LOST")}>Lost</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DealerLayout>
  );
}
