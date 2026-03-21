import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ onMenuToggle }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
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
    <header className="bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-b border-[#e5e5ea] dark:border-[#2c2c2e] flex items-center justify-between px-5 sm:px-6 h-14 shrink-0 sticky top-0 z-30">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
        <span className="text-sm font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
          Hyundai DMS
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#86868b] hover:text-red-500 dark:hover:text-red-400 hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline font-medium">Sign out</span>
        </button>
      </div>

    </header>
  );
}
