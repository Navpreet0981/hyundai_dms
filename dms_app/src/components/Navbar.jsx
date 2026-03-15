import { Sun, Moon, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDark(false);
    }
  }, []);

  const toggleTheme = () => {

    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center px-6 py-3">

      <h3 className="text-gray-700 dark:text-gray-200 font-medium">
        Hyundai DMS
      </h3>

      <div className="flex items-center gap-4">

        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          {dark ? (
  <Sun size={18} className="text-yellow-400" />
) : (
  <Moon size={18} className="text-gray-700" />
)}
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          <LogOut size={16}/>
          Logout
        </button>

      </div>

    </div>
  );
}