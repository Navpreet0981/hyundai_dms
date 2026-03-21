import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { SkeletonTable } from "../../components/Skeleton";

const btnPrimary = "px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors";
const btnDanger = "px-3 py-1 text-xs text-red-500 dark:text-red-400 hover:text-red-700 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    api.get("/bookings")
      .then(res => setBookings(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBookings(); }, []);

  const updateStatus = (id, status) => {
    api.put(`/bookings/${id}/status?status=${status}`)
      .then(() => setBookings(prev => prev.map(b => b.bookingId === id ? { ...b, status } : b)));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">Bookings</h2>

        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-4 text-left font-medium">Customer</th>
                  <th className="p-4 text-left font-medium">Variant</th>
                  <th className="p-4 text-left font-medium">Dealer</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="6" className="text-center p-6 text-gray-400">No bookings found</td></tr>
                ) : bookings.map(b => (
                  <tr key={b.bookingId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                    <td className="p-4 text-gray-800 dark:text-gray-200">{b.customerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{b.variantName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{b.dealerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{b.bookingDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(b.bookingId, "CONFIRMED")}>Confirm Booking</button>
                        <button className={btnOutline} onClick={() => updateStatus(b.bookingId, "DELIVERED")}>Mark Delivered</button>
                        <button className={btnDanger} onClick={() => updateStatus(b.bookingId, "CANCELLED")}>Cancel</button>
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
