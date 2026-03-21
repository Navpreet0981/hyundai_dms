import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function AddCustomer() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "", state: "", address: "",
    interestedModel: "", leadSource: "SHOWROOM"
  });
  const [cars, setCars] = useState([]);

  useEffect(() => {
    api.get("/cars")
      .then(res => setCars(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) return;
    }
    setForm({ ...form, [name]: value });
  };

  const saveCustomer = () => {
    if (!form.name || !form.phone || !form.email) {
      alert("Please fill required fields"); return;
    }
    if (form.phone.length !== 10) {
      alert("Phone number must be 10 digits"); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Invalid email format"); return;
    }
    const payload = { ...form, phone: `+91${form.phone}` };
    api.post("/customers", payload)
      .then(() => {
        alert("Customer Created");
        setForm({ name: "", phone: "", email: "", city: "", state: "", address: "", interestedModel: "", leadSource: "SHOWROOM" });
      })
      .catch(err => console.log(err));
  };

  return (
    <EmployeeLayout>
      <div className="flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 sm:p-8">

          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center mb-6">
            Add Customer
          </h1>

          <div className="space-y-4">

            <input
              name="name" required placeholder="Customer Name"
              value={form.name} onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex">
              <span className="flex items-center px-3 border border-r-0 border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 rounded-l-lg text-gray-600 dark:text-gray-300 text-sm">
                +91
              </span>
              <input
                name="phone" required placeholder="10 digit phone"
                value={form.phone} onChange={handleChange} maxLength={10}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              name="email" type="email" required placeholder="Email"
              value={form.email} onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="city" placeholder="City" value={form.city} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg"
              />
              <input
                name="state" placeholder="State" value={form.state} onChange={handleChange}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg"
              />
            </div>

            <input
              name="address" placeholder="Address" value={form.address} onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg"
            />

            {/* INTERESTED MODEL — fetched from /cars */}
            <select
              name="interestedModel" value={form.interestedModel} onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg"
            >
              <option value="">Select Interested Model</option>
              {cars.map(car => (
                <option key={car.carId} value={car.modelName}>{car.modelName}</option>
              ))}
            </select>

            <select
              name="leadSource" value={form.leadSource} onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg"
            >
              <option value="SHOWROOM">Showroom Walk-in</option>
              <option value="WEBSITE">Website</option>
              <option value="CALL">Phone Call</option>
              <option value="REFERRAL">Referral</option>
            </select>

            <button
              onClick={saveCustomer}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Save Customer
            </button>

          </div>
        </div>
      </div>
    </EmployeeLayout>
  );
}
