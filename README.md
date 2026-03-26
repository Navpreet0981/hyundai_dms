# Hyundai Dealer Management System (DMS)

A full-stack Dealer Management System built to simulate real dealership operations for Hyundai showrooms. It manages dealers, employees, customers, vehicle leads, bookings, and service requests — with role-based dashboards and analytics for admins, dealers, and employees.

---

## Features

- JWT Authentication (implemented)
- Role-Based Access Control (Admin / Dealer / Employee)
- Admin Dashboard with analytics
- Dealer Dashboard with performance metrics
- Employee Dashboard with lead and customer management
- Dealer Management
- Employee Management
- Customer Management (walk-in + online leads)
- Lead Tracking with status flow
- Vehicle & Variant Management
- Booking Management
- Test Drive Management
- Service Request Management
- Sales Analytics & Lead Conversion Reports
- Dealer Performance Reports

---

## Tech Stack

### Backend
- Java 17
- Spring Boot 4.0.3
- Spring Data JPA / Hibernate
- Spring Security
- JWT (JJWT 0.12.6)
- MySQL
- Lombok
- Maven

### Frontend
- React.js
- React Router
- REST API Integration (Axios / Fetch)
- Context API (Auth)

### Tools
- Git / GitHub
- Postman
- MySQL Workbench
- IntelliJ IDEA / VS Code

---

## Project Structure

```
hyundai_dms/
│
├── backend/dms-managment/
│   └── src/main/java/com/hyundai/dms/
│       ├── auth/               # JWT login & token handling
│       ├── config/             # Security & CORS config
│       ├── controller/         # REST controllers
│       ├── dto/                # Data Transfer Objects
│       ├── entity/             # JPA entities
│       ├── enums/              # Status & role enums
│       ├── mapper/             # Entity <-> DTO mappers
│       ├── repository/         # Spring Data JPA repos
│       ├── security/           # JWT filter & user details
│       └── service/            # Business logic
│
└── dms_app/                    # React frontend
    └── src/
        ├── api/                # API call functions
        ├── components/         # Shared UI (Navbar, Sidebar, etc.)
        ├── hooks/              # Custom React hooks
        ├── layouts/            # Role-based layout wrappers
        ├── pages/
        │   ├── admin/          # Admin dashboard & management pages
        │   ├── dealer/         # Dealer dashboard & reports
        │   ├── employee/       # Employee tools & lead management
        │   └── auth/           # Login & auth context
        └── routes/             # Route definitions
```

---

## Main Modules

### Auth
- JWT-based login for Admin, Dealer, and Employee roles
- Token stored client-side, validated on every request
- Role-based route protection on both frontend and backend

### Admin
- Full system overview dashboard
- Manage dealers, employees, customers, and cars
- Sales analytics and lead conversion reports
- Dealer performance comparison

### Dealer
- Dealer-specific dashboard with KPIs
- Manage own employees, customers, leads, bookings
- View test drives and service requests
- Performance and sales reports

### Employee
- Personal dashboard with assigned leads and customers
- Add walk-in customers and service requests
- Manage test drives and bookings
- Lead follow-up tracking

### Customer
- Created from online leads or walk-in entries
- Linked to employee and dealer

### Lead
- Tracks customer interest through the full sales funnel

### Vehicle
- Car models and variants with pricing info

### Booking
- Created when a customer confirms a purchase

### Service Request
- Post-sale service tracking per customer

---

## Lead Flow

```
New Lead → Contacted → Test Drive → Negotiation → Booked → Delivered
```

---

## API Documentation

- Postman Workspace: [Open Documentation](https://navpreet-507-4051843.postman.co/workspace/848f182b-30f1-4443-8b00-553e03dd6fe7/documentation/3Ff5AB0d8EA918F8C4F70cbb)

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/your-username/hyundai-dms.git

# Navigate to backend
cd backend/dms-managment

# Create the database
mysql -u root -p -e "CREATE DATABASE dms_db;"

# Set your DB password as env variable (or update application.properties)
export DB_PASSWORD=your_password

# Run the app
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd dms_app
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## Environment Variables

| Variable      | Description              | Default         |
|---------------|--------------------------|-----------------|
| `DB_PASSWORD` | MySQL root password      | *(set in env)*  |
| `jwt.secret`  | JWT signing secret       | *(in app props)*|
| `jwt.expiration` | Token TTL in ms       | `86400000` (1d) |

---

## Roles & Access

| Role     | Access                                                  |
|----------|---------------------------------------------------------|
| Admin    | Full system access, analytics, dealer/employee mgmt     |
| Dealer   | Own dealership data, employees, reports                 |
| Employee | Assigned leads, customers, bookings, service requests   |

---

## Author

Navpreet Singh
