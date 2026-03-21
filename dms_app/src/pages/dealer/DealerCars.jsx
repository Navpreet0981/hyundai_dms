import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";

export default function DealerCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cars")
      .then(res => setCars(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DealerLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Available Cars</h1>

        {loading ? (
          <SkeletonTable rows={5} cols={4} />
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-left min-w-[480px]">
              <thead className="border-b border-gray-200 dark:border-slate-800">
                <tr className="text-gray-600 dark:text-gray-300 text-sm">
                  <th className="p-4">Model</th>
                  <th className="p-4">Fuel Type</th>
                  <th className="p-4">Transmission</th>
                  <th className="p-4">Base Price</th>
                </tr>
              </thead>
              <tbody>
                {cars.map(car => (
                  <tr key={car.carId} className="border-b border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{car.modelName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{car.fuelType}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">{car.transmission}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-300">₹{car.basePrice?.toLocaleString()}</td>
                  </tr>
                ))}
                {cars.length === 0 && (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500">No cars available.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </DealerLayout>
  );
}
