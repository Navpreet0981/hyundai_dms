import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import AdminLayout from "../../layouts/AdminLayout";
import { SkeletonTable } from "../../components/Skeleton";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [variants, setVariants] = useState([]);
  const [openCar, setOpenCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cars")
      .then(res => setCars(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleCar = (carId) => {
    if (openCar === carId) {
      setOpenCar(null);
      setVariants([]);
    } else {
      setOpenCar(carId);
      api.get(`/variants/car/${carId}`)
        .then(res => setVariants(res.data))
        .catch(err => console.log(err));
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Car Catalog
        </h1>

        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[560px]">
              <thead className="border-b border-gray-200 dark:border-slate-800">
                <tr className="text-gray-600 dark:text-gray-300 text-sm">
                  <th className="p-4">Model</th>
                  <th className="p-4">Fuel</th>
                  <th className="p-4">Transmission</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Variants</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <>
                    <tr
                      key={car.carId}
                      className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer"
                      onClick={() => toggleCar(car.carId)}
                    >
                      <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{car.modelName}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{car.fuelType}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">{car.transmission}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-300">₹{car.basePrice.toLocaleString()}</td>
                      <td className="p-4 text-blue-600 font-medium">Click to view</td>
                    </tr>

                    {openCar === car.carId && (
                      <tr className="bg-gray-50 dark:bg-slate-800">
                        <td colSpan="5" className="p-4">
                          <div className="space-y-2">
                            {variants.map(v => (
                              <div key={v.variantId} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 dark:border-slate-700 py-2 gap-1">
                                <span className="font-medium text-gray-800 dark:text-gray-200">{v.variantName}</span>
                                <span className="text-gray-600 dark:text-gray-300">{v.engineType}</span>
                                <span className="text-green-600 font-semibold">₹{v.price.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
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
    </AdminLayout>
  );
}
