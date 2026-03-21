import { useState } from "react";
import api from "../../api/axiosClient";
import DealerLayout from "../../layouts/DealerLayout";
import { useNavigate } from "react-router-dom";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", phone: "", email: "", password: "", role: ""
  });
  const [loading, setLoading] = useState(false);

  const roles = ["SALES_EXECUTIVE", "SALES_MANAGER", "SERVICE_MANAGER", "TECHNICIAN"];

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) return;
    }
    setForm({ ...form, [name]: value });
  };

  const saveEmployee = () => {
    if (!form.name || !form.phone || !form.email || !form.password || !form.role) {
      alert("Please fill all required fields"); return;
    }
    if (form.phone.length !== 10) {
      alert("Phone must be 10 digits"); return;
    }
    setLoading(true);
    const payload = { ...form, phone: `+91${form.phone}` };
    api.post("/dealer/employees", payload)
      .then(() => { alert("Employee added successfully"); navigate("/dealer/employees"); })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  return (
    <DealerLayout>
      <div className="flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 sm:p-8">

          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center mb-6">
            Add Employee
          </h1>

          <div className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex">
              <span className="flex items-center px-3 border border-r-0 border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 rounded-l-lg text-gray-600 dark:text-gray-300 text-sm">
                +91
              </span>
              <input
                name="phone"
                placeholder="10 digit phone"
                value={form.phone}
                onChange={handleChange}
                maxLength={10}
                className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg"
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role} value={role}>{role.replaceAll("_", " ")}</option>
              ))}
            </select>

            <button
              onClick={saveEmployee}
              disabled={loading}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Save Employee
            </button>

            <button
              onClick={() => navigate("/dealer/employees")}
              className="w-full border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 py-3 rounded-lg font-medium transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>

          </div>
        </div>
      </div>
    </DealerLayout>
  );
}
