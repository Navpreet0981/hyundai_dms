import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminDealerPerformance from "../pages/admin/DealerPerformance";
import SalesAnalytics from "../pages/admin/salesAnalytics";
import Dealers from "../pages/admin/Dealers";
import Employees from "../pages/admin/Employees";
import Customers from "../pages/admin/Customers";
import Cars from "../pages/admin/Cars";
import AdminAnalytics from "../pages/admin/AdminAnalytics";

import DealerDashboard from "../pages/dealer/DealerDashboard";
import DealerEmployees from "../pages/dealer/DealerEmployees";
import AddEmployee from "../pages/dealer/AddEmployee";
import DealerLeads from "../pages/dealer/DealerLeads";
import DealerCustomers from "../pages/dealer/DealerCustomers";
import DealerTestDrives from "../pages/dealer/DealerTestDrives";
import DealerBookings from "../pages/dealer/DealerBookings";
import DealerPerformance from "../pages/dealer/DealerPerformance";
import DealerReports from "../pages/dealer/DealerReports";
import DealerProfile from "../pages/dealer/DealerProfile";

import Leads from "../pages/employee/Leads";
import TestDrives from "../pages/employee/TestDrives";
import Bookings from "../pages/employee/Bookings";
import ServiceRequests from "../pages/employee/ServiceRequests";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import AddCustomer from "../pages/employee/AddCustomer";
import MyCustomers from "../pages/employee/MyCustomers";
import Reports from "../pages/employee/Reports";
import Profile from "../pages/employee/Profile";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ================= ADMIN ROUTES ================= */}

        <Route path="/admin" element={
          <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
        } />

        <Route path="/dealer-performance" element={
          <ProtectedRoute role="ADMIN"><AdminDealerPerformance /></ProtectedRoute>
        } />

        <Route path="/sales" element={
          <ProtectedRoute role="ADMIN"><SalesAnalytics /></ProtectedRoute>
        } />

        <Route path="/dealers" element={
          <ProtectedRoute role="ADMIN"><Dealers /></ProtectedRoute>
        } />

        <Route path="/employees" element={
          <ProtectedRoute role="ADMIN"><Employees /></ProtectedRoute>
        } />

        <Route path="/customers" element={
          <ProtectedRoute role="ADMIN"><Customers /></ProtectedRoute>
        } />

        <Route path="/cars" element={
          <ProtectedRoute role="ADMIN"><Cars /></ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute role="ADMIN"><AdminAnalytics /></ProtectedRoute>
        } />

        {/* ================= DEALER ROUTES ================= */}

        <Route path="/dealer" element={
          <ProtectedRoute role="DEALER"><DealerDashboard /></ProtectedRoute>
        } />

        <Route path="/dealer/employees" element={
          <ProtectedRoute role="DEALER"><DealerEmployees /></ProtectedRoute>
        } />

        <Route path="/dealer/add-employee" element={
          <ProtectedRoute role="DEALER"><AddEmployee /></ProtectedRoute>
        } />

        <Route path="/dealer/leads" element={
          <ProtectedRoute role="DEALER"><DealerLeads /></ProtectedRoute>
        } />

        <Route path="/dealer/customers" element={
          <ProtectedRoute role="DEALER"><DealerCustomers /></ProtectedRoute>
        } />

        <Route path="/dealer/testdrives" element={
          <ProtectedRoute role="DEALER"><DealerTestDrives /></ProtectedRoute>
        } />

        <Route path="/dealer/bookings" element={
          <ProtectedRoute role="DEALER"><DealerBookings /></ProtectedRoute>
        } />

        <Route path="/dealer/performance" element={
          <ProtectedRoute role="DEALER"><DealerPerformance /></ProtectedRoute>
        } />

        <Route path="/dealer/reports" element={
          <ProtectedRoute role="DEALER"><DealerReports /></ProtectedRoute>
        } />

        <Route path="/dealer/profile" element={
          <ProtectedRoute role="DEALER"><DealerProfile /></ProtectedRoute>
        } />

        {/* ================= EMPLOYEE ROUTES ================= */}

        <Route path="/employee-dashboard" element={
          <ProtectedRoute role="EMPLOYEE"><EmployeeDashboard /></ProtectedRoute>
        } />

        <Route path="/leads" element={
          <ProtectedRoute role="EMPLOYEE"><Leads /></ProtectedRoute>
        } />

        <Route path="/add-customer" element={
          <ProtectedRoute role="EMPLOYEE"><AddCustomer /></ProtectedRoute>
        } />

        <Route path="/testdrives" element={
          <ProtectedRoute role="EMPLOYEE"><TestDrives /></ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute role="EMPLOYEE"><Bookings /></ProtectedRoute>
        } />

        <Route path="/service-requests" element={
          <ProtectedRoute role="EMPLOYEE"><ServiceRequests /></ProtectedRoute>
        } />

        <Route path="/my-customers" element={
          <ProtectedRoute role="EMPLOYEE"><MyCustomers /></ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute role="EMPLOYEE"><Reports /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute role="EMPLOYEE"><Profile /></ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}
