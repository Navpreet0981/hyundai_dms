import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function AddCustomer() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", state: "", address: "", interestedModel: "", leadSource: "SHOWROOM" });
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get("/cars").then(res => setCars(res.data)).catch(err => console.log(err)); }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") { value = value.replace(/\D/g, ""); if (value.length > 10) return; }
    setForm({ ...form, [name]: value });
  };

  const saveCustomer = () => {
    if (!form.name || !form.phone || !form.email) { alert("Please fill required fields"); return; }
    if (form.phone.length !== 10) { alert("Phone number must be 10 digits"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { alert("Invalid email format"); return; }
    setLoading(true);
    api.post("/customers", { ...form, phone: `+91${form.phone}` })
      .then(() => { alert("Customer Created"); setForm({ name: "", phone: "", email: "", city: "", state: "", address: "", interestedModel: "", leadSource: "SHOWROOM" }); })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <EmployeeLayout>
      <div className="flex justify-center px-4">
        <div className="apple-card w-full max-w-lg p-6 sm:p-8 space-y-4">

          <h1 className="apple-title text-center">Add Customer</h1>

          <input name="name" required placeholder="Customer Name" value={form.name} onChange={handleChange} className="apple-input" />

          <div className="flex">
            <span className="flex items-center px-3 border border-r-0 border-[#e5e5ea] dark:border-[#3a3a3c] bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-l-xl text-[#86868b] text-sm">+91</span>
            <input name="phone" required placeholder="10 digit phone" value={form.phone} onChange={handleChange} maxLength={10}
              className="flex-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7] px-4 py-3 text-sm rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]" />
          </div>

          <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange} className="apple-input" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="apple-input" />
            <input name="state" placeholder="State" value={form.state} onChange={handleChange} className="apple-input" />
          </div>

          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="apple-input" />

          <select name="interestedModel" value={form.interestedModel} onChange={handleChange} className="apple-input">
            <option value="">Select Interested Model</option>
            {cars.map(car => <option key={car.carId} value={car.modelName}>{car.modelName}</option>)}
          </select>

          <select name="leadSource" value={form.leadSource} onChange={handleChange} className="apple-input">
            <option value="SHOWROOM">Showroom Walk-in</option>
            <option value="WEBSITE">Website</option>
            <option value="CALL">Phone Call</option>
            <option value="REFERRAL">Referral</option>
          </select>

          <button onClick={saveCustomer} disabled={loading} className="apple-btn-primary w-full flex justify-center items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? "Saving…" : "Save Customer"}
          </button>

        </div>
      </div>
    </EmployeeLayout>
  );
}
