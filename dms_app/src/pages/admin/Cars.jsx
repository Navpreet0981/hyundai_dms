import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { PlusCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { SkeletonTable } from "../../components/Skeleton";

const inputCls = "w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [variantMap, setVariantMap] = useState({});
  const [openCar, setOpenCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCarModal, setShowCarModal] = useState(false);
  const [carForm, setCarForm] = useState({ modelName: "", fuelType: "", transmission: "", basePrice: "" });
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantTargetCarId, setVariantTargetCarId] = useState(null);
  const [variantForm, setVariantForm] = useState({ variantName: "", engineType: "", price: "" });

  const loadCars = () => {
    api.get("/cars")
      .then(res => setCars(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCars(); }, []);

  const toggleCar = (carId) => {
    if (openCar === carId) { setOpenCar(null); return; }
    setOpenCar(carId);
    if (!variantMap[carId]) {
      api.get(`/variants/car/${carId}`)
        .then(res => setVariantMap(prev => ({ ...prev, [carId]: res.data })))
        .catch(err => console.log(err));
    }
  };

  const addCar = () => {
    if (!carForm.modelName || !carForm.basePrice) { alert("Fill required fields"); return; }
    api.post("/cars", { ...carForm, basePrice: parseFloat(carForm.basePrice) })
      .then(() => { setShowCarModal(false); setCarForm({ modelName: "", fuelType: "", transmission: "", basePrice: "" }); loadCars(); })
      .catch(err => console.log(err));
  };

  const deleteCar = (id) => {
    api.delete(`/cars/${id}`)
      .then(() => { setCars(prev => prev.filter(c => c.carId !== id)); setVariantMap(prev => { const n = { ...prev }; delete n[id]; return n; }); })
      .catch(err => console.log(err));
  };

  const openAddVariant = (carId) => { setVariantTargetCarId(carId); setVariantForm({ variantName: "", engineType: "", price: "" }); setShowVariantModal(true); };

  const addVariant = () => {
    if (!variantForm.variantName || !variantForm.price) { alert("Fill required fields"); return; }
    api.post("/variants", { ...variantForm, price: parseFloat(variantForm.price), carId: variantTargetCarId })
      .then(res => { setVariantMap(prev => ({ ...prev, [variantTargetCarId]: [...(prev[variantTargetCarId] || []), res.data] })); setShowVariantModal(false); })
      .catch(err => console.log(err));
  };

  const deleteVariant = (carId, variantId) => {
    api.delete(`/variants/${variantId}`)
      .then(() => setVariantMap(prev => ({ ...prev, [carId]: prev[carId].filter(v => v.variantId !== variantId) })))
      .catch(err => console.log(err));
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Car Catalog</h1>
          <button
            onClick={() => setShowCarModal(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <PlusCircle size={16} /> Add Car
          </button>
        </div>

        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead className="border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800">
                <tr className="text-gray-500 dark:text-gray-400 text-sm">
                  <th className="p-4 font-medium">Model</th>
                  <th className="p-4 font-medium">Fuel</th>
                  <th className="p-4 font-medium">Transmission</th>
                  <th className="p-4 font-medium">Base Price</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <>
                    <tr
                      key={car.carId}
                      className="border-t border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer"
                      onClick={() => toggleCar(car.carId)}
                    >
                      <td className="p-4 font-medium text-gray-800 dark:text-gray-200">
                        <span className="flex items-center gap-2">
                          {openCar === car.carId ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                          {car.modelName}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{car.fuelType}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{car.transmission}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">₹{car.basePrice?.toLocaleString()}</td>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openAddVariant(car.carId)}
                            className="flex items-center gap-1 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-3 py-1 rounded text-xs transition-colors"
                          >
                            <PlusCircle size={12} /> Add Variant
                          </button>
                          <button
                            onClick={() => deleteCar(car.carId)}
                            className="text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>

                    {openCar === car.carId && (
                      <tr className="bg-gray-50 dark:bg-slate-800/60">
                        <td colSpan="5" className="px-8 py-4">
                          {!variantMap[car.carId] ? (
                            <p className="text-sm text-gray-400">Loading variants...</p>
                          ) : variantMap[car.carId].length === 0 ? (
                            <p className="text-sm text-gray-400">No variants added yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {variantMap[car.carId].map(v => (
                                <div key={v.variantId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-slate-700 py-2 gap-2">
                                  <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{v.variantName}</span>
                                  <span className="text-gray-400 text-sm">{v.engineType}</span>
                                  <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">₹{v.price?.toLocaleString()}</span>
                                  <button
                                    onClick={() => deleteVariant(car.carId, v.variantId)}
                                    className="text-xs text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded w-fit transition-colors"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD CAR MODAL */}
      {showCarModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 border border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Add New Car</h2>
              <button onClick={() => setShowCarModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={18} /></button>
            </div>
            <input placeholder="Model Name *" value={carForm.modelName} onChange={e => setCarForm({ ...carForm, modelName: e.target.value })} className={inputCls} />
            <select value={carForm.fuelType} onChange={e => setCarForm({ ...carForm, fuelType: e.target.value })} className={inputCls}>
              <option value="">Select Fuel Type</option>
              <option>PETROL</option><option>DIESEL</option><option>ELECTRIC</option><option>CNG</option>
            </select>
            <select value={carForm.transmission} onChange={e => setCarForm({ ...carForm, transmission: e.target.value })} className={inputCls}>
              <option value="">Select Transmission</option>
              <option>MANUAL</option><option>AUTOMATIC</option>
            </select>
            <input type="number" placeholder="Base Price *" value={carForm.basePrice} onChange={e => setCarForm({ ...carForm, basePrice: e.target.value })} className={inputCls} />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowCarModal(false)} className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={addCar} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors">Create Car</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD VARIANT MODAL */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full max-w-md p-6 space-y-4 border border-gray-200 dark:border-slate-700">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">Add Variant</h2>
              <button onClick={() => setShowVariantModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={18} /></button>
            </div>
            <input placeholder="Variant Name *" value={variantForm.variantName} onChange={e => setVariantForm({ ...variantForm, variantName: e.target.value })} className={inputCls} />
            <input placeholder="Engine Type (e.g. 1.5L Turbo)" value={variantForm.engineType} onChange={e => setVariantForm({ ...variantForm, engineType: e.target.value })} className={inputCls} />
            <input type="number" placeholder="Price *" value={variantForm.price} onChange={e => setVariantForm({ ...variantForm, price: e.target.value })} className={inputCls} />
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowVariantModal(false)} className="flex-1 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={addVariant} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors">Add Variant</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
