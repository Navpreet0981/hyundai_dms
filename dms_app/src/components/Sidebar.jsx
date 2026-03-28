import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Users, UserPlus, Car, CalendarCheck, Wrench,
  FileText, User, ChevronLeft, ChevronRight, BarChart3, Building2,
  UserCog, TrendingUp, X, ShieldCheck
} from "lucide-react";

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = {
    EMPLOYEE: [
      { name: "Dashboard",       path: "/employee-dashboard", icon: LayoutDashboard },
      { name: "Customer Leads",  path: "/leads",              icon: Users },
      { name: "Add Customer",    path: "/add-customer",       icon: UserPlus },
      { name: "Test Drives",     path: "/testdrives",         icon: Car },
      { name: "Bookings",        path: "/bookings",           icon: CalendarCheck },
      { name: "Service Requests",path: "/service-requests",   icon: Wrench },
      { name: "Add Service Requests",path: "/add-service-requests",   icon: Wrench },
      { name: "My Customers",    path: "/my-customers",       icon: Users },
      { name: "Reports",         path: "/reports",            icon: FileText },
      { name: "Profile",         path: "/profile",            icon: User },
    ],
    ADMIN: [
      { name: "Dashboard",         path: "/admin",              icon: LayoutDashboard },
      { name: "Dealers",           path: "/dealers",            icon: Building2 },
      { name: "Employees",         path: "/employees",          icon: UserCog },
      { name: "Customers",         path: "/customers",          icon: Users },
      { name: "Cars",              path: "/cars",               icon: Car },
      { name: "Sales Analytics",   path: "/sales",              icon: TrendingUp },
      { name: "Dealer Performance",path: "/dealer-performance", icon: BarChart3 },
      { name: "Admin Analytics",   path: "/analytics",          icon: FileText },
      { name: "Audit Log",         path: "/audit",              icon: ShieldCheck },
    ],
    DEALER: [
      { name: "Dashboard",  path: "/dealer",             icon: LayoutDashboard },
      { name: "Employees",  path: "/dealer/employees",   icon: UserCog },
      { name: "Leads",      path: "/dealer/leads",       icon: Users },
      { name: "Customers",  path: "/dealer/customers",   icon: User },
      { name: "Test Drives",path: "/dealer/testdrives",  icon: Car },
      { name: "Bookings",   path: "/dealer/bookings",    icon: CalendarCheck },
      { name: "Cars",       path: "/dealer/cars",        icon: Car },
      { name: "Performance",path: "/dealer/performance", icon: TrendingUp },
      { name: "Reports",    path: "/dealer/reports",     icon: BarChart3 },
      { name: "Audit Log",  path: "/dealer/audit",       icon: ShieldCheck },
      { name: "Profile",    path: "/dealer/profile",     icon: User },
    ],
  };

  const items = menuItems[role] || [];

  const SidebarContent = ({ mobile = false }) => (
    <div className={`bg-white dark:bg-[#1c1c1e] border-r border-[#e5e5ea] dark:border-[#2c2c2e]
      h-full flex flex-col transition-all duration-300
      ${!mobile && collapsed ? "w-[68px]" : "w-[240px]"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-[#e5e5ea] dark:border-[#2c2c2e] shrink-0">
        {(!collapsed || mobile) && (
          <img src="/hmi_logo.png" alt="Hyundai" className="h-12 w-auto max-w-[140px] object-contain" />
        )}
        {collapsed && !mobile && <div className="w-5" />}

        {mobile ? (
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors"
          >
            <X size={16} />
          </button>
        ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] text-[#86868b] transition-colors"
          >
            {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {items.map((item, i) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={i}
              to={item.path}
              onClick={mobile ? onMobileClose : undefined}
              title={collapsed && !mobile ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${active
                  ? "bg-[#0071e3] text-white"
                  : "text-[#6e6e73] dark:text-[#86868b] hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]"
                }`}
            >
              <Icon size={17} className="shrink-0" />
              {(!collapsed || mobile) && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer role badge */}
      {(!collapsed || mobile) && (
        <div className="px-4 py-4 border-t border-[#e5e5ea] dark:border-[#2c2c2e]">
          <span className="text-xs text-[#86868b] font-medium">{role}</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <SidebarContent mobile />
          </div>
        </>
      )}
    </>
  );
}
