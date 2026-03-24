import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";

const btnPrimary = "px-3 py-1 text-xs bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-lg transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-lg transition-colors";
const btnDanger  = "px-3 py-1 text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  useEffect(() => {
    setLoading(true);
    api.get(`/bookings/paged?page=${page}&size=${size}`)
      .then(res => {
        setBookings(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [page, size, setTotalPages]);

  const updateStatus = (id, status) => {
    api.put(`/bookings/${id}/status?status=${status}`)
      .then(() => setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status } : b)))
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">

        <h1 className="apple-title">Bookings</h1>

        {loading ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Customer","Variant","Dealer","Date","Status","Actions"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-10 text-[#86868b] text-sm">No bookings found</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.bookingId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{b.customerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{b.variantName}</td>
                    <td className="apple-table-cell text-[#86868b]">{b.dealerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{b.bookingDate}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]">
                        {b.status}
                      </span>
                    </td>
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(b.bookingId, "CONFIRMED")}>Confirm</button>
                        <button className={btnOutline} onClick={() => updateStatus(b.bookingId, "DELIVERED")}>Delivered</button>
                        <button className={btnDanger}  onClick={() => updateStatus(b.bookingId, "CANCELLED")}>Cancel</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </div>
        )}

      </div>
    </EmployeeLayout>
  );
}
