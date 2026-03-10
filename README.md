# Hyundai Dealer Management System (DMS)

This project is a backend-driven Dealer Management System built to simulate real dealership operations for Hyundai showrooms.  
It manages dealers, employees, customers, vehicle leads, and bookings. The system also provides analytics to track sales performance and lead conversions.

The project is designed as a full-stack application with a Spring Boot backend and a frontend dashboard.

---

## Features

- Dealer Management
- Employee Management
- Customer Management
- Lead Tracking
- Vehicle Management
- Booking Management
- Dealer Performance Analytics
- Lead Conversion Metrics
- Walk-in Customer Entry by Employees
- JWT Authentication (in progress)

---

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- MySQL
- Maven

### Frontend
- React.js / HTML / CSS / JavaScript
- REST API Integration

### Tools
- Git
- GitHub
- Postman
- MySQL Workbench
- IntelliJ IDEA / VS Code

---

## Project Structure
hyundai_dms
│
├── controller
├── service
├── repository
├── entity
├── dto
├── config
└── resources

---

## Main Modules

### Dealer
-Handles dealership creation and management.

### Employee
-Employees belong to a dealer and manage leads and customers.

### Customer
Customers can be created from:
- Online leads
- Walk-in showroom customers

### Lead
-Tracks customer interest and follow-up stages.

### Vehicle
-Stores car model and variant information.

### Booking
Stores booking information when a customer purchases a vehicle.

---

## Lead Flow
New Lead → Contacted → Test Drive → Negotiation → Booked → Delivered

---

## Example API Endpoints
POST /dealers
POST /employees
POST /customers
GET /vehicles
POST /bookings
GET /analytics/dealer-performance


---

## Future Improvements

- JWT Authentication
- Admin Dashboard
- Dealer Performance Reports
- Frontend Analytics Dashboard
- Role Based Access Control

---

## Author

Navpreet Singh
