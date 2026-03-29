import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";

export default function AddCustomer() {
  const [form, setForm]     = useState({ name: "", phone: "", email: "", city: "", state: "", address: "", interestedModel: "", leadSource: "SHOWROOM" });
  const [cars, setCars]     = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch car models on mount to populate the interested model dropdown
  useEffect(() => { api.get("/cars").then(res => setCars(res.data)).catch(err => console.log(err)); }, []);

  // Generic field change handler — strips non-digits from phone and enforces 10-digit max
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") { value = value.replace(/\D/g, ""); if (value.length > 10) return; }
    setForm({ ...form, [name]: value });
  };

  // Validates required fields and email format, then calls POST /customers
  // Backend auto-assigns the employee and dealer from the JWT token
  const saveCustomer = () => {
    if (!form.name || !form.phone || !form.email) { alert("Please fill required fields"); return; }
    if (form.phone.length !== 10) { alert("Phone number must be 10 digits"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { alert("Invalid email format"); return; }
    setLoading(true);
    // Prepend +91 country code before sending to backend
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

          {/* Phone input with +91 prefix — digits only, max 10 */}
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

          {/* Car model dropdown — populated from GET /cars */}
          <select name="interestedModel" value={form.interestedModel} onChange={handleChange} className="apple-input">
            <option value="">Select Interested Model</option>
            {cars.map(car => <option key={car.carId} value={car.modelName}>{car.modelName}</option>)}
          </select>

          {/* Lead source dropdown — maps to backend leadSource field */}
          <select name="leadSource" value={form.leadSource} onChange={handleChange} className="apple-input">
            <option value="SHOWROOM">Showroom Walk-in</option>
            <option value="WEBSITE">Website</option>
            <option value="CALL">Phone Call</option>
            <option value="REFERRAL">Referral</option>
          </select>

          {/* Submit button — disabled and shows spinner while API call is in flight */}
          <button onClick={saveCustomer} disabled={loading} className="apple-btn-primary w-full flex justify-center items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? "Saving…" : "Save Customer"}
          </button>

        </div>
      </div>
    </EmployeeLayout>
  );
}
