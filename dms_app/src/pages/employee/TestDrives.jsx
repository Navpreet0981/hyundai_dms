import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useLocation } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";

const btnPrimary = "px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors";
const btnDanger = "px-3 py-1 text-xs text-red-500 dark:text-red-400 hover:text-red-700 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors";

export default function TestDrives() {
  const location = useLocation();
  const selectedCustomer = location.state?.customer;

  const [testDrives, setTestDrives] = useState([]);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState("");
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");

  useEffect(() => {
    api.get("/cars").then(res => setCars(res.data)).catch(err => console.log(err));
    loadTestDrives();
  }, []);

  useEffect(() => {
    if (!selectedCarId) { setVariants([]); setSelectedVariantId(""); return; }
    api.get(`/variants/car/${selectedCarId}`)
      .then(res => { setVariants(res.data); setSelectedVariantId(""); })
      .catch(err => console.log(err));
  }, [selectedCarId]);

  const loadTestDrives = () => {
    api.get("/testdrives")
      .then(res => setTestDrives(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  const createTestDrive = () => {
    if (!date) { alert("Please select a date"); return; }
    if (!selectedVariantId) { alert("Please select a car variant"); return; }
    api.post("/testdrives", {
      customerId: selectedCustomer.customerId,
      dealerId: selectedCustomer.dealerId,
      employeeId: selectedCustomer.employeeId,
      variantId: parseInt(selectedVariantId),
      testDriveDate: date,
      status: "REQUESTED"
    })
      .then(() => {
        alert("Test Drive Scheduled");
        setDate(""); setSelectedCarId(""); setSelectedVariantId(""); setVariants([]);
        loadTestDrives();
      })
      .catch(err => console.log(err));
  };

  const updateStatus = (id, status) => {
    api.put(`/testdrives/${id}/status?status=${status}`)
      .then(() => loadTestDrives())
      .catch(err => console.log(err));
  };

  const createBooking = (testDrive) => {
    api.post("/bookings", {
      customerId: testDrive.customerId,
      dealerId: testDrive.dealerId,
      employeeId: testDrive.employeeId,
      variantId: testDrive.variantId,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "PENDING"
    })
      .then(() => alert("Booking Created"))
      .catch(err => console.log(err));
  };

  const selectCls = "w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-400";

  return (
    <EmployeeLayout>
      <div className="space-y-6">

        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Test Drives</h2>

        {selectedCustomer && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 max-w-lg">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Schedule Test Drive</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1 mb-4">
              <p><span className="text-gray-700 dark:text-gray-300 font-medium">Customer:</span> {selectedCustomer.name}</p>
              <p><span className="text-gray-700 dark:text-gray-300 font-medium">Phone:</span> {selectedCustomer.phone}</p>
              <p><span className="text-gray-700 dark:text-gray-300 font-medium">Interested In:</span> {selectedCustomer.interestedModel}</p>
            </div>
            <div className="space-y-3">
              <select value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} className={selectCls}>
                <option value="">Select Car Model</option>
                {cars.map(c => <option key={c.carId} value={c.carId}>{c.modelName}</option>)}
              </select>
              {selectedCarId && (
                <select value={selectedVariantId} onChange={e => setSelectedVariantId(e.target.value)} className={selectCls}>
                  <option value="">Select Variant</option>
                  {variants.map(v => (
                    <option key={v.variantId} value={v.variantId}>{v.variantName} — ₹{v.price?.toLocaleString()}</option>
                  ))}
                </select>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 p-2 rounded w-full text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
                <button
                  onClick={createTestDrive}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded text-sm whitespace-nowrap transition-colors"
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <SkeletonTable rows={5} cols={7} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-4 text-left font-medium">Customer</th>
                  <th className="p-4 text-left font-medium">Variant</th>
                  <th className="p-4 text-left font-medium">Dealer</th>
                  <th className="p-4 text-left font-medium">Employee</th>
                  <th className="p-4 text-left font-medium">Date</th>
                  <th className="p-4 text-left font-medium">Status</th>
                  <th className="p-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testDrives.length === 0 ? (
                  <tr><td colSpan="7" className="text-center p-6 text-gray-400">No test drives found</td></tr>
                ) : testDrives.map(t => (
                  <tr key={t.testDriveId} className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 text-gray-800 dark:text-gray-200">{t.customerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.variantName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.dealerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.employeeName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{t.testDriveDate}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(t.testDriveId, "CONFIRMED")}>Confirm</button>
                        <button className={btnOutline} onClick={() => updateStatus(t.testDriveId, "COMPLETED")}>Mark Completed</button>
                        <button className={btnDanger} onClick={() => updateStatus(t.testDriveId, "CANCELLED")}>Cancel</button>
                        {t.status === "COMPLETED" && (
                          <button className={btnPrimary} onClick={() => createBooking(t)}>Convert to Booking</button>
                        )}
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
