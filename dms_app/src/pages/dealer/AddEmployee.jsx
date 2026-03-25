import { useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", role: "" });
  const [loading, setLoading] = useState(false);
  const roles = ["SALES_EXECUTIVE", "SALES_MANAGER", "SERVICE_MANAGER", "TECHNICIAN"];

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") { value = value.replace(/\D/g, ""); if (value.length > 10) return; }
    setForm({ ...form, [name]: value });
  };

  const saveEmployee = () => {
    if (!form.name || !form.phone || !form.email || !form.password || !form.role) { alert("Please fill all required fields"); return; }
    if (form.phone.length !== 10) { alert("Phone must be 10 digits"); return; }
    setLoading(true);
    api.post("/employees", { ...form, phone: `+91${form.phone}` })
      .then(() => { alert("Employee added successfully"); navigate("/dealer/employees"); })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <DealerLayout>
      <div className="flex justify-center px-4">
        <div className="apple-card w-full max-w-lg p-6 sm:p-8 space-y-4">

          <h1 className="apple-title text-center">Add Employee</h1>

          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="apple-input" />

          <div className="flex">
            <span className="flex items-center px-3 border border-r-0 border-[#e5e5ea] dark:border-[#3a3a3c] bg-[#f5f5f7] dark:bg-[#2c2c2e] rounded-l-xl text-[#86868b] text-sm">+91</span>
            <input name="phone" placeholder="10 digit phone" value={form.phone} onChange={handleChange} maxLength={10}
              className="flex-1 bg-[#f5f5f7] dark:bg-[#2c2c2e] border border-[#e5e5ea] dark:border-[#3a3a3c] text-[#1d1d1f] dark:text-[#f5f5f7] px-4 py-3 text-sm rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3]" />
          </div>

          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="apple-input" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="apple-input" />

          <select name="role" value={form.role} onChange={handleChange} className="apple-input">
            <option value="">Select Role</option>
            {roles.map(r => <option key={r} value={r}>{r.replaceAll("_", " ")}</option>)}
          </select>

          <button onClick={saveEmployee} disabled={loading} className="apple-btn-primary w-full flex justify-center items-center gap-2">
            {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {loading ? "Saving…" : "Save Employee"}
          </button>

          <button onClick={() => navigate("/dealer/employees")} className="apple-btn-secondary w-full">Cancel</button>

        </div>
      </div>
    </DealerLayout>
  );
}
