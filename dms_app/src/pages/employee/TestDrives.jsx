import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useLocation } from "react-router-dom";
import { SkeletonTable } from "../../components/Skeleton";
import usePagination from "../../hooks/usePagination";
import Pagination from "../../components/Pagination";
import { useTestDrivesPaged, useCars, useVariants } from "../../hooks/useQueries";

const btnPrimary = "px-3 py-1 text-xs bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-lg transition-colors";
const btnOutline = "px-3 py-1 text-xs border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] rounded-lg transition-colors";
const btnDanger  = "px-3 py-1 text-xs text-red-500 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors";

export default function TestDrives() {
  const location = useLocation();
  const selectedCustomer = location.state?.customer;
  const qc = useQueryClient();

  const [date, setDate]                     = useState("");
  const [selectedCarId, setSelectedCarId]   = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const { page, size, totalPages, setPage, setTotalPages } = usePagination(0, 10);

  const { data: tdData, isLoading: loading } = useTestDrivesPaged(page, size);
  const testDrives = tdData?.content ?? [];

  useEffect(() => { if (tdData?.totalPages !== undefined) setTotalPages(tdData.totalPages); }, [tdData?.totalPages, setTotalPages]);

  const { data: cars = [] } = useCars();
  const { data: variants = [] } = useVariants(selectedCarId || null);

  // reset variant when car changes
  useEffect(() => { setSelectedVariantId(""); }, [selectedCarId]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ['testdrives-paged'] });

  const createTestDrive = () => {
    if (!date) { alert("Please select a date"); return; }
    if (!selectedVariantId) { alert("Please select a car variant"); return; }
    api.post("/testdrives", {
      customerId: selectedCustomer.customerId,
      dealerId: selectedCustomer.dealerId,
      employeeId: selectedCustomer.employeeId,
      variantId: parseInt(selectedVariantId),
      testDriveDate: date,
      status: "REQUESTED",
    })
      .then(() => { alert("Test Drive Scheduled"); setDate(""); setSelectedCarId(""); setSelectedVariantId(""); invalidate(); })
      .catch(err => console.log(err));
  };

  const updateStatus = (id, status) => {
    api.put(`/testdrives/${id}/status?status=${status}`).then(invalidate).catch(err => console.log(err));
  };

  const createBooking = (testDrive) => {
    // Check inventory before booking
    api.get(`/dealer/inventory/check?dealerId=${testDrive.dealerId}&variantId=${testDrive.variantId}`)
      .then(res => {
        if (!res.data.inStock) {
          alert("⚠️ Out of Stock — This variant is not available in the dealer's inventory.");
          return;
        }
        api.post("/bookings", {
          customerId: testDrive.customerId,
          dealerId: testDrive.dealerId,
          employeeId: testDrive.employeeId,
          variantId: testDrive.variantId,
          bookingDate: new Date().toISOString().split("T")[0],
          status: "PENDING",
        })
          .then(() => { alert("Booking Created"); invalidate(); })
          .catch(err => {
            const msg = err.response?.data?.message || "";
            if (msg === "OUT_OF_STOCK") {
              alert("⚠️ Out of Stock — This variant is not available in the dealer's inventory.");
            } else {
              console.log(err);
            }
          });
      })
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        <h1 className="apple-title">Test Drives</h1>

        {selectedCustomer && (
          <div className="apple-card p-6 max-w-lg">
            <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-3">Schedule Test Drive</h3>
            <div className="text-sm text-[#86868b] space-y-1 mb-4">
              <p><span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">Customer:</span> {selectedCustomer.name}</p>
              <p><span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">Phone:</span> {selectedCustomer.phone}</p>
              <p><span className="text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">Interested In:</span> {selectedCustomer.interestedModel}</p>
            </div>
            <div className="space-y-3">
              <select value={selectedCarId} onChange={e => setSelectedCarId(e.target.value)} className="apple-input">
                <option value="">Select Car Model</option>
                {cars.map(c => <option key={c.carId} value={c.carId}>{c.modelName}</option>)}
              </select>
              {selectedCarId && (
                <select value={selectedVariantId} onChange={e => setSelectedVariantId(e.target.value)} className="apple-input">
                  <option value="">Select Variant</option>
                  {variants.map(v => <option key={v.variantId} value={v.variantId}>{v.variantName} — ₹{v.price?.toLocaleString()}</option>)}
                </select>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="apple-input" />
                <button onClick={createTestDrive} className="apple-btn-primary whitespace-nowrap">Confirm Schedule</button>
              </div>
            </div>
          </div>
        )}

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>{["Customer","Variant","Dealer","Employee","Date","Status","Actions"].map((h, i) => <th key={i} className="apple-table-header">{h}</th>)}</tr>
              </thead>
              <tbody>
                {testDrives.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-10 text-[#86868b] text-sm">No test drives found</td></tr>
                ) : testDrives.map(t => (
                  <tr key={t.testDriveId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{t.customerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{t.variantName}</td>
                    <td className="apple-table-cell text-[#86868b]">{t.dealerName}</td>
                    <td className="apple-table-cell text-[#86868b]">{t.employeeName}</td>
                    <td className="apple-table-cell text-[#86868b]">{t.testDriveDate}</td>
                    <td className="apple-table-cell">
                      <span className="apple-badge bg-[#f5f5f7] dark:bg-[#2c2c2e] text-[#6e6e73] dark:text-[#86868b]">{t.status}</span>
                    </td>
                    <td className="apple-table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        <button className={btnPrimary} onClick={() => updateStatus(t.testDriveId, "CONFIRMED")}>Confirm</button>
                        <button className={btnOutline} onClick={() => updateStatus(t.testDriveId, "COMPLETED")}>Completed</button>
                        <button className={btnDanger}  onClick={() => updateStatus(t.testDriveId, "CANCELLED")}>Cancel</button>
                        {t.status === "COMPLETED" && (
                          <button className={btnPrimary} onClick={() => createBooking(t)}>→ Booking</button>
                        )}
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
