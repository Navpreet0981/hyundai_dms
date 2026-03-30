import { useState } from "react";
import api from "../../api/axiosClient";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const login = async () => {
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setError("");
    try {
      setLoading(true);
      // Role is no longer sent — backend resolves it from the users table
      const res = await api.post("/auth/login", { email, password });

      const token = res.data.token;
      const role  = res.data.role;   // ADMIN | DEALER | EMPLOYEE — returned by backend

      localStorage.setItem("token",  token);
      localStorage.setItem("role",   role);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("name",   res.data.name);
      localStorage.setItem("email",  res.data.email);

      // 50ms delay ensures localStorage writes flush before new page reads them
      setTimeout(() => {
        if (role === "ADMIN")    window.location.href = "/admin";
        if (role === "DEALER")   window.location.href = "/dealer";
        if (role === "EMPLOYEE") window.location.href = "/employee-dashboard";
      }, 50);
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") login(); };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black flex items-center justify-center px-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#0071e3]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0071e3]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[400px]">

        <div className="text-center mb-8">
          <img src="/hmi_logo.png" alt="Hyundai" className="w-20 mx-auto mb-5 object-contain" />
          <h1 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
            Dealer Management
          </h1>
          <p className="text-sm text-[#86868b] mt-1">Sign in to your workspace</p>
        </div>

        <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl border border-[#e5e5ea] dark:border-[#2c2c2e] shadow-apple p-8">

          <div className="space-y-3 mb-5">
            <input
              className="apple-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="email"
            />
            <input
              className="apple-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 mb-4 text-center">{error}</p>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="apple-btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {loading ? "Signing in…" : "Sign In"}
          </button>

        </div>

        <p className="text-center text-xs text-[#86868b] mt-6">
          Hyundai Motor India · DMS
        </p>

      </div>
    </div>
  );
}
