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
    status: "OPEN" // default status on creation
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(false);

  // Fetch employee's customers on mount to populate the customer dropdown
  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to fetch customers");
      });
  }, []);

  // Generic field change handler — updates matching key in form state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Validates required fields then calls POST /service-requests
  // Backend auto-resolves the variant from the customer's existing booking
  const saveRequest = () => {
    if (!form.customerId || !form.issueDescription || !form.serviceDate) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    api.post("/service-requests", form)
      .then(() => {
        alert("Service request created");
        navigate("/service-requests"); // redirect back to list after success
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

          {/* Customer dropdown — only shows customers assigned to this employee */}
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

          {/* Issue description — free text field */}
          <textarea
            name="issueDescription"
            placeholder="Describe issue"
            value={form.issueDescription}
            onChange={handleChange}
            className="apple-input"
          />

          {/* Service date picker */}
          <input
            type="date"
            name="serviceDate"
            value={form.serviceDate}
            onChange={handleChange}
            className="apple-input"
          />

          {/* Submit button — disabled and shows text change while loading */}
          <button
            onClick={saveRequest}
            disabled={loading}
            className="apple-btn-primary w-full"
          >
            {loading ? "Saving..." : "Save Request"}
          </button>

          {/* Cancel navigates back without saving */}
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
