import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import EmployeeLayout from "../../layouts/EmployeeLayout";
import { useNavigate } from "react-router-dom";

export default function AddServiceRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerId: "",
    issueDescription: "",
    serviceDate: "",
    status: "OPEN"
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch customers only
  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to fetch customers");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const saveRequest = () => {
    if (!form.customerId || !form.issueDescription || !form.serviceDate) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    api.post("/service-requests", form)
      .then(() => {
        alert("Service request created");
        navigate("/service-requests");
      })
      .catch(err => {
        console.error(err.response?.data || err.message);
        alert(err.response?.data || "Failed to create request");
      })
      .finally(() => setLoading(false));
  };

  return (
    <EmployeeLayout>
      <div className="flex justify-center px-4">
        <div className="apple-card w-full max-w-lg p-6 space-y-4">

          <h1 className="apple-title text-center">Add Service Request</h1>

          {/* Customer */}
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            className="apple-input"
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.customerId} value={c.customerId}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Issue */}
          <textarea
            name="issueDescription"
            placeholder="Describe issue"
            value={form.issueDescription}
            onChange={handleChange}
            className="apple-input"
          />

          {/* Date */}
          <input
            type="date"
            name="serviceDate"
            value={form.serviceDate}
            onChange={handleChange}
            className="apple-input"
          />

          {/* Buttons */}
          <button
            onClick={saveRequest}
            disabled={loading}
            className="apple-btn-primary w-full"
          >
            {loading ? "Saving..." : "Save Request"}
          </button>

          <button
            onClick={() => navigate("/service-requests")}
            className="apple-btn-secondary w-full"
          >
            Cancel
          </button>

        </div>
      </div>
    </EmployeeLayout>
  );
}