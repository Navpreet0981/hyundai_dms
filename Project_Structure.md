# **FRONTEND STRUCTURE** 



src/

│

├── api/

│   └── axiosClient.js

│

├── components/

│   ├── Navbar.jsx

│   ├── Sidebar.jsx

│   └── Skeleton.jsx

│

├── layouts/

│   ├── AdminLayout.jsx

│   ├── DealerLayout.jsx

│   └── EmployeeLayout.jsx

│

├── pages/

│   │

│   ├── admin/

│   │   ├── AdminAnalytics.jsx

│   │   ├── AdminDashboard.jsx

│   │   ├── Cars.jsx

│   │   ├── Customers.jsx

│   │   ├── DealerPerformance.jsx

│   │   ├── Dealers.jsx

│   │   ├── Employees.jsx

│   │   └── salesAnalytics.jsx

│   │

│   ├── auth/

│   │   ├── AuthContext.jsx

│   │   └── LoginPage.jsx

│   │

│   ├── dealer/

│   │   ├── AddEmployee.jsx

│   │   ├── DealerBookings.jsx

│   │   ├── DealerCars.jsx

│   │   ├── DealerCustomers.jsx

│   │   ├── DealerDashboard.jsx

│   │   ├── DealerEmployees.jsx

│   │   ├── DealerLeads.jsx

│   │   ├── DealerPerformance.jsx

│   │   ├── DealerProfile.jsx

│   │   ├── DealerReports.jsx

│   │   └── DealerTestDrives.jsx

│   │

│   ├── employee/

│   │   ├── AddCustomer.jsx

│   │   ├── Bookings.jsx

│   │   ├── EmployeeDashboard.jsx

│   │   ├── Leads.jsx

│   │   ├── MyCustomers.jsx

│   │   ├── Profile.jsx

│   │   ├── Reports.jsx

│   │   ├── ServiceRequests.jsx

│   │   └── TestDrives.jsx

│

├── routes/

│   ├── AppRoutes.jsx

│   └── ProtectedRoute.jsx

│

├── App.css

├── App.js

├── App.test.js

├── index.css

|--- index.js



# **BACKEND STRUCTURE**



com.hyundai.dms

│

├── auth/

│   ├── AuthController.java

│   ├── AuthService.java

│   ├── LoginRequest.java

│   └── LoginResponse.java

│

├── config/

│   ├── CorsConfig.java

│   └── SecurityConfig.java

│

├── controller/

│   ├── BookingController.java

│   ├── CarController.java

│   ├── CarVariantController.java

│   ├── CustomerController.java

│   ├── DashboardController.java

│   ├── DealerController.java

│   ├── DealerDashboardController.java

│   ├── DealerEmployeeController.java

│   ├── DealerPerformanceController.java

│   ├── DealerProfileController.java

│   ├── DealerSalesController.java

│   ├── EmployeeController.java

│   ├── EmployeeDashboardController.java

│   ├── LeadConversionController.java

│   ├── LeadSourceController.java

│   ├── SalesAnalyticsController.java

│   ├── ServiceRequestController.java

│   └── TestDriveController.java

│

├── dto/

│   ├── AdminSalesSummaryDTO.java

│   ├── BookingDTO.java

│   ├── CarDTO.java

│   ├── CarVariantDTO.java

│   ├── CustomerDTO.java

│   ├── DashboardDTO.java

│   ├── DealerDashboardDTO.java

│   ├── DealerPerformanceDTO.java

│   ├── EmployeeDTO.java

│   ├── LeadConversionDTO.java

│   ├── LeadSourceDTO.java

│   ├── SalesAnalyticsDTO.java

│   ├── ServiceRequestDTO.java

│   └── TestDriveDTO.java

│

├── entity/

│   ├── Admin.java

│   ├── Booking.java

│   ├── Car.java

│   ├── CarVariant.java

│   ├── Customer.java

│   ├── Dealer.java

│   ├── Employee.java

│   ├── ServiceRequest.java

│   └── TestDrive.java

│

├── enums/

│   ├── BookingStatus.java

│   ├── EmployeeRole.java

│   ├── EmployeeStatus.java

│   ├── LeadStatus.java

│   └── TestDriveStatus.java

│

├── mapper/

│   ├── BookingMapper.java

│   ├── CarMapper.java

│   ├── CarVariantMapper.java

│   ├── CustomerMapper.java

│   ├── ServiceRequestMapper.java

│   └── TestDriveMapper.java

│

├── repository/

│   ├── AdminRepository.java

│   ├── BookingRepository.java

│   ├── CarRepository.java

│   ├── CarVariantRepository.java

│   ├── CustomerRepository.java

│   ├── DealerRepository.java

│   ├── EmployeeRepository.java

│   ├── LeadSourceService.java

│   ├── ServiceRequestRepository.java

│   └── TestDriveRepository.java

│

├── security/

│   └── util/

│       ├── CurrentUserUtil.java

│       ├── JwtFilter.java

│       └── JwtService.java

│

├── service/

│   │

│   ├── impl/

│   │   ├── DashboardServiceImpl.java

│   │   ├── DealerDashboardServiceImpl.java

│   │   ├── LeadAssignmentServiceImpl.java

│   │   ├── LeadSourceServiceImpl.java

│   │   └── SalesAnalyticsServiceImpl.java

│   │

│   ├── BookingService.java

│   ├── CarService.java

│   ├── CarVariantService.java

│   ├── CustomerService.java

│   ├── DashboardService.java

│   ├── DealerDashboardService.java

│   ├── DealerService.java

│   ├── EmployeeService.java

│   ├── LeadAssignmentService.java

│   ├── LeadConversionService.java

│   ├── SalesAnalyticsService.java

│   ├── ServiceRequestService.java

│   └── TestDriveService.java

│

|\_\_\_\_ DMSManagment.java

# 

# **ADMIN ENDPOINTS**

