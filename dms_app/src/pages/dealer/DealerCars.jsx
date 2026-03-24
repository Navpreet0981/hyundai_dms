import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { SkeletonTable } from "../../components/Skeleton";

export default function DealerCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cars").then(res => setCars(res.data)).catch(err => console.log(err)).finally(() => setLoading(false));
  }, []);

  return (
    <DealerLayout>
      <div className="space-y-5">
        <h1 className="apple-title">Available Cars</h1>

        {loading ? <SkeletonTable rows={5} /> : (
          <div className="apple-card overflow-x-auto">
            <table className="w-full text-left min-w-[480px]">
              <thead className="border-b border-[#e5e5ea] dark:border-[#2c2c2e]">
                <tr>
                  {["Model","Fuel Type","Transmission","Base Price"].map((h, i) => (
                    <th key={i} className="apple-table-header">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cars.length === 0 ? (
                  <tr><td colSpan="4" className="text-center py-10 text-[#86868b] text-sm">No cars available</td></tr>
                ) : cars.map(car => (
                  <tr key={car.carId} className="apple-table-row">
                    <td className="apple-table-cell font-medium">{car.modelName}</td>
                    <td className="apple-table-cell text-[#86868b]">{car.fuelType}</td>
                    <td className="apple-table-cell text-[#86868b]">{car.transmission}</td>
                    <td className="apple-table-cell text-[#86868b]">₹{car.basePrice?.toLocaleString()}</td>
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
