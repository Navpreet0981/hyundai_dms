import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { SkeletonTable } from "../../components/Skeleton";
import { useCars, useVariants } from "../../hooks/useQueries";

// Sub-component that renders variant rows for an expanded car — only mounts when car is expanded
function VariantRows({ carId, onDelete }) {
  // Fetch variants for this specific car — query only fires when this component is mounted
  const { data: variants, isLoading } = useVariants(carId);

  if (isLoading) return (
    <tr className="bg-[#f5f5f7] dark:bg-[#2c2c2e]">
      <td colSpan="5" className="px-8 py-4 apple-subtitle text-sm">Loading variants…</td>
    </tr>
  );

  return (
    <tr className="bg-[#f5f5f7] dark:bg-[#2c2c2e]">
      <td colSpan="5" className="px-8 py-4">
        {!variants || variants.length === 0 ? (
          <p className="apple-subtitle text-sm">No variants added yet.</p>
        ) : (
          <div className="space-y-2">
            {variants.map(v => (
              <div key={v.variantId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e5ea] dark:border-[#3a3a3c] py-2 gap-2">
                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] text-sm">{v.variantName}</span>
                <span className="apple-subtitle text-sm">{v.engineType}</span>
                <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7] text-sm">₹{v.price?.toLocaleString()}</span>
                {/* Delete variant — passes both carId and variantId so parent can invalidate correct cache */}
                <button onClick={() => onDelete(carId, v.variantId)}
                  className="px-2 py-1 text-xs text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-fit transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}

export default function Cars() {
  const qc = useQueryClient();

  // openCar stores the carId of the currently expanded row — null means all collapsed
  const [openCar, setOpenCar]           = useState(null);
  const [showCarModal, setShowCarModal] = useState(false);
  const [carForm, setCarForm]           = useState({ modelName: "", fuelType: "", transmission: "", basePrice: "" });
  const [showVariantModal, setShowVariantModal] = useState(false);

  // Tracks which car the "Add Variant" modal is targeting
  const [variantTargetCarId, setVariantTargetCarId] = useState(null);
  const [variantForm, setVariantForm] = useState({ variantName: "", engineType: "", price: "" });

  // Fetch all cars — no pagination, full list
  const { data: cars = [], isLoading: loading } = useCars();

  // Invalidate all cars cache after add/delete car
  const invalidateCars = () => qc.invalidateQueries({ queryKey: ['cars'] });

  // Invalidate only the specific car's variants cache — avoids refetching all cars
  const invalidateVariants = (carId) => qc.invalidateQueries({ queryKey: ['variants', carId] });

  // Toggle expand/collapse for a car row — clicking same car again collapses it
  const toggleCar = (carId) => setOpenCar(prev => prev === carId ? null : carId);

  // Validate and submit new car to POST /cars, then refresh car list
  const addCar = () => {
    if (!carForm.modelName || !carForm.basePrice) { alert("Fill required fields"); return; }
    api.post("/cars", { ...carForm, basePrice: parseFloat(carForm.basePrice) })
      .then(() => { setShowCarModal(false); setCarForm({ modelName: "", fuelType: "", transmission: "", basePrice: "" }); invalidateCars(); })
      .catch(err => console.log(err));
  };

  // Hard delete a car by ID and refresh the car list
  const deleteCar = (id) => {
    api.delete(`/cars/${id}`).then(invalidateCars).catch(err => console.log(err));
  };

  // Open the add variant modal pre-targeted to a specific car
  const openAddVariant = (carId) => {
    setVariantTargetCarId(carId);
    setVariantForm({ variantName: "", engineType: "", price: "" });
    setShowVariantModal(true);
  };

  // Validate and submit new variant to POST /variants, then refresh only that car's variants
  const addVariant = () => {
    if (!variantForm.variantName || !variantForm.price) { alert("Fill required fields"); return; }
    api.post("/variants", { ...variantForm, price: parseFloat(variantForm.price), carId: variantTargetCarId })
      .then(() => { setShowVariantModal(false); invalidateVariants(variantTargetCarId); })
      .catch(err => console.log(err));
  };

  // Delete a variant and refresh only that car's variants cache — not the full car list
  const deleteVariant = (carId, variantId) => {
    api.delete(`/variants/${variantId}`).then(() => invalidateVariants(carId)).catch(err => console.log(err));
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="apple-title">Car Catalog</h1>
          <button onClick={() => setShowCarModal(true)} className="apple-btn-primary flex items-center gap-2">
            <PlusCircle size={16} /> Add Car
          </button>
        </div>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Model","Fuel","Transmission","Base Price","Actions"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-10 apple-subtitle">No cars found</td></tr>
                ) : cars.map(car => (
                  <>
                    {/* Clicking the row toggles variant expansion */}
                    <tr key={car.carId} className="apple-table-row cursor-pointer" onClick={() => toggleCar(car.carId)}>
                      <td className="apple-table-cell font-medium">
                        <span className="flex items-center gap-2">
                          {openCar === car.carId ? <ChevronUp size={14} className="text-[#86868b]" /> : <ChevronDown size={14} className="text-[#86868b]" />}
                          {car.modelName}
                        </span>
                      </td>
                      <td className="apple-table-cell text-[#86868b]">{car.fuelType}</td>
                      <td className="apple-table-cell text-[#86868b]">{car.transmission}</td>
                      <td className="apple-table-cell text-[#86868b]">₹{car.basePrice?.toLocaleString()}</td>
                      {/* stopPropagation prevents row click (expand) from firing when clicking action buttons */}
                      <td className="apple-table-cell" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button onClick={() => openAddVariant(car.carId)}
                            className="apple-btn-secondary flex items-center gap-1 !px-3 !py-1.5 !text-xs">
                            <PlusCircle size={12} /> Add Variant
                          </button>
                          <button onClick={() => deleteCar(car.carId)}
                            className="px-3 py-1.5 text-xs text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* VariantRows only mounts when this car is expanded — triggers its own query */}
                    {openCar === car.carId && <VariantRows carId={car.carId} onDelete={deleteVariant} />}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD CAR MODAL */}
      {showCarModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Add New Car</h2>
              <button onClick={() => setShowCarModal(false)} className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"><X size={18} /></button>
            </div>
            <input placeholder="Model Name *" value={carForm.modelName} onChange={e => setCarForm({ ...carForm, modelName: e.target.value })} className="apple-input" />
            <select value={carForm.fuelType} onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })} className="apple-input">
              <option value="">Select Fuel Type</option>
              <option>PETROL</option><option>DIESEL</option><option>ELECTRIC</option><option>CNG</option>
            </select>
            <select value={carForm.transmission} onChange={e => setCarForm({ ...carForm, transmission: e.target.value })} className="apple-input">
              <option value="">Select Transmission</option>
              <option>MANUAL</option><option>AUTOMATIC</option>
            </select>
            <input type="number" placeholder="Base Price *" value={carForm.basePrice} onChange={e => setCarForm({ ...carForm, basePrice: e.target.value })} className="apple-input" />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowCarModal(false)} className="apple-btn-secondary flex-1">Cancel</button>
              <button onClick={addCar} className="apple-btn-primary flex-1">Create Car</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VARIANT MODAL — pre-targeted to variantTargetCarId */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="apple-card w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Add Variant</h2>
              <button onClick={() => setShowVariantModal(false)} className="text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] transition-colors"><X size={18} /></button>
            </div>
            <input placeholder="Variant Name *" value={variantForm.variantName} onChange={e => setVariantForm({ ...variantForm, variantName: e.target.value })} className="apple-input" />
            <input placeholder="Engine Type (e.g. 1.5L Turbo)" value={variantForm.engineType} onChange={e => setVariantForm({ ...variantForm, engineType: e.target.value })} className="apple-input" />
            <input type="number" placeholder="Price *" value={variantForm.price} onChange={e => setVariantForm({ ...variantForm, price: e.target.value })} className="apple-input" />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowVariantModal(false)} className="apple-btn-secondary flex-1">Cancel</button>
              <button onClick={addVariant} className="apple-btn-primary flex-1">Add Variant</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
