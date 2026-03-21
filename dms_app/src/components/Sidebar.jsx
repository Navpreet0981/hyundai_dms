import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

import {
  LayoutDashboard,
  Users,
  UserPlus,
  Car,
  CalendarCheck,
  Wrench,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Building2,
  UserCog,
  TrendingUp
} from "lucide-react"

export default function Sidebar() {

  const role = localStorage.getItem("role")
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)

  const menuItems = {

    EMPLOYEE: [
      { name: "Dashboard", path: "/employee-dashboard", icon: LayoutDashboard },
      { name: "Customer Leads", path: "/leads", icon: Users },
      { name: "Add Customer", path: "/add-customer", icon: UserPlus },
      { name: "Test Drives", path: "/testdrives", icon: Car },
      { name: "Bookings", path: "/bookings", icon: CalendarCheck },
      { name: "Service Requests", path: "/service-requests", icon: Wrench },
      { name: "My Customers", path: "/my-customers", icon: Users },
      { name: "Reports", path: "/reports", icon: FileText },
      { name: "Profile", path: "/profile", icon: User }
    ],

    ADMIN: [
      { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
      { name: "Dealers", path: "/dealers", icon: Building2 },
      { name: "Employees", path: "/employees", icon: UserCog },
      { name: "Customers", path: "/customers", icon: Users },
      { name: "Cars", path: "/cars", icon: Car },
      { name: "Sales Analytics", path: "/sales", icon: TrendingUp },
      { name: "Dealer Performance", path: "/dealer-performance", icon: BarChart3 },
      { name: "Admin Analytics", path: "/analytics", icon: FileText }
    ],

    DEALER: [
      { name: "Dashboard", path: "/dealer", icon: LayoutDashboard },
      { name: "Employees", path: "/dealer/employees", icon: UserCog },
      { name: "Leads", path: "/dealer/leads", icon: Users },
      { name: "Customers", path: "/dealer/customers", icon: User },
      { name: "Test Drives", path: "/dealer/testdrives", icon: Car },
      { name: "Bookings", path: "/dealer/bookings", icon: CalendarCheck },
      { name: "Performance", path: "/dealer/performance", icon: TrendingUp },
      { name: "Reports", path: "/dealer/reports", icon: BarChart3 },
      { name: "Profile", path: "/dealer/profile", icon: User }
    ]

  }

  const items = menuItems[role] || []

  return (

    <div
      className={`bg-slate-900 text-white min-h-screen transition-all duration-300
      ${collapsed ? "w-20" : "w-64"} p-4 flex flex-col`}
    >

      {/* Logo + Collapse */}
      <div className="flex items-center justify-between mb-8 h-12">

        {!collapsed ? (
          <img
            src="/hmi_logo.png"
            alt="Hyundai"
            className="w-28 object-contain justify-center items-center  "
          />
        ) : (
          <div className="w-28"></div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-slate-700 transition"
        >
          {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
        </button>

      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-2">

        {items.map((item, index) => {

          const Icon = item.icon
          const active = location.pathname === item.path

          return (

            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition
              ${active ? "bg-blue-600" : "hover:bg-slate-800"}`}
            >

              <Icon size={20} />

              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              )}

            </Link>

          )
        })}

      </nav>

    </div>
  )
}