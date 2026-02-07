# 🏥 Smart Appointment & Queue Manager

A comprehensive, production-ready solution for service-based businesses to eliminate wait-time uncertainty and optimize staff productivity.

---

## 📈 Business Logic & Vision

In service-oriented environments—such as clinics, consulting firms, and service bureaus—the challenge is often twofold: managing high-priority scheduled appointments while gracefully handling overflow and walk-ins.

**Smart Appointment & Queue Manager** is built to bridge this gap by treating time as a precious resource. The system doesn't just record appointments; it actively manages professional bandwidth.

### The Core Problem Solved:

- **Overbooking & Conflicts**: Prevents overlapping schedules for specialists.
- **Staff Underutilization**: Maximizes daily capacity through intelligent tracking.
- **Wait-Time Anxiety**: Provides transparency through a prioritized waiting queue when specialists are at peak capacity.
- **Role-Based Resource Matching**: Ensures only the right professional (e.g., Doctor, Consultant) is assigned to the appropriate service.

---

## ✨ Product Capabilities

### 🗓️ Intelligent Scheduling

Customers can book specific services tailored to their needs. The system automatically detects conflicts and ensures that the assigned staff member is available and qualified for the specific service type.

### 👥 Specialized Staff Management

Manage your workforce with precision. Track specialized roles (Doctor, Consultant, Support), manage daily capacities, and toggle real-time availability (Available vs. On Leave) to ensure the system only assigns active staff.

### ⏱️ Dynamic Waiting Queue

When a service window is full or a specific staff member is unavailable, the system doesn't turn customers away. Instead, they are added to a **Smart Waiting Queue**.

- **Queue Transparency**: Track exactly where a customer is in line (1st, 2nd, etc.).
- **Intelligent Auto-Assignment**: A "Best Match" algorithm that automatically pairs the next person in the queue with the first available qualified staff member.

### 📊 Real-Time Operations Dashboard

A mission-control center for business owners:

- **Instant Pulse**: View today's total, completed, pending, and cancelled activities at a glance.
- **Heatmap of Load**: Real-time visualization of staff workload (e.g., "3 of 5 capacity used") to prevent burnout.
- **Activity Transparency**: A full audit trail of assignments and status changes for accountability.


## 🛠 Tech Stack

### Frontend (Modern SaaS UI)

- **Next.js 14 (App Router)**: High-performance React framework.
- **TypeScript**: Type-safe development.
- **Styled-Components**: For a premium, customizable design system.
- **Zustand**: Lightweight and efficient state management.
- **Zod & React Hook Form**: Robust validation and form handling.

### Backend (Scalable Modular Architecture)

- **Node.js & Express**: Fast, unopinionated server infrastructure.
- **Modular Feature-Based Architecture**: Grouped by business logic (Auth, Staff, Appointments) for rapid scaling.
- **Drizzle ORM + PostgreSQL**: Type-safe database interactions with a relational foundation.
- **JWT Authentication**: Secure, stateless user sessions.

---

## 📁 Project Architecture

Following a recent architectural refactor, the backend now follows a **Modular Feature-Based Structure**, ensuring that as the business grows, the code remains manageable.

```
backend/src/
├── app.ts                 # Global middleware & app initialization
├── server.ts              # Database connection & bootstrap logic
├── config/                # Centralized environment & DB config
├── modules/               # Independent feature modules
│   ├── appointments/      # Conflict logic & scheduling
│   ├── auth/              # Identity management
│   ├── staff/             # Resource management
│   ├── services/          # Product/Service definitions
│   └── queue/             # Assignment & prioritization logic
├── middlewares/           # Shared guards (Auth, Error handling)
└── utils/                 # Cross-cutting utilities (Logger, ApiResponse)
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+

### 2. Database Setup

```bash
createdb appointment_queue_db
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env # Update with your DB credentials
npm run db:push     # Synchronize schema
npm run dev         # Start at http://localhost:3001
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev         # Start at http://localhost:3000
```

---

## 📡 Key API Endpoints

| Area             | Features                                         |
| ---------------- | ------------------------------------------------ |
| **Auth**         | Login, Signup, Session Management                |
| **Appointments** | Create, Cancel, Complete, Conflict Check         |
| **Staff**        | Fleet Management, Capacity, Availability         |
| **Queue**        | Auto-Assign, Manual Assignment, Priority List    |
| **Stats**        | Global Performance Metrics & Staff Load Heatmaps |

---

## 📝 License

MIT License - Developed as a high-performance, modular appointment management solution.
