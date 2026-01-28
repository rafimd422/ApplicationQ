# Smart Appointment & Queue Manager

A production-ready, full-stack web application for managing appointments, staff scheduling, and waiting queues. Built with modern technologies and a beautiful SaaS dashboard design.

![Tech Stack](https://img.shields.io/badge/Frontend-Next.js%2014-black)
![Tech Stack](https://img.shields.io/badge/Backend-Express.js-green)
![Tech Stack](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Tech Stack](https://img.shields.io/badge/ORM-Drizzle-orange)

## 🚀 Features

### Authentication

- Email + Password signup & login
- JWT-based authentication with protected routes
- Demo login with pre-filled credentials

### Staff Management

- Create, edit, delete staff members
- Staff types: Doctor, Consultant, Support Agent
- Daily capacity tracking
- Availability status (Available / On Leave)

### Service Management

- Create services with configurable duration (15, 30, 60 min)
- Link services to required staff type

### Appointment Management

- Create, edit, cancel appointments
- View by date with filtering
- Status tracking: Scheduled, Completed, Cancelled, No-Show
- **Conflict detection** for overlapping appointments
- **Staff availability display** showing capacity (e.g., "3/5 appointments")

### Waiting Queue

- Automatic queue placement when no staff available
- Queue position tracking (1st, 2nd, 3rd...)
- **Auto-assign** button for intelligent assignment
- Manual staff assignment from queue

### Dashboard

- Today's appointment statistics
- Completed vs Pending counts
- Waiting queue count
- Staff load summary with visual indicators

### Activity Log

- Track assignment events
- Appointment creation/cancellation logs
- Timestamps with relative time display

## 🛠 Tech Stack

### Frontend

- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **styled-components** for styling
- **Zustand** for state management
- **React Hook Form** + **Zod** for form handling
- **dayjs** for date manipulation
- **Axios** for API calls

### Backend

- **Node.js** with **Express.js**
- **TypeScript**
- **Drizzle ORM** for database operations
- **PostgreSQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── db/
│   │   │   ├── schema/      # Drizzle ORM schemas
│   │   │   └── migrations/  # Database migrations
│   │   ├── middleware/      # Auth & error handling
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Zod schemas
│   │   └── index.ts         # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js App Router pages
    │   ├── components/
    │   │   ├── ui/          # Reusable UI components
    │   │   └── layout/      # Layout components
    │   ├── services/        # API service layer
    │   ├── store/           # Zustand stores
    │   ├── styles/          # Theme & global styles
    │   └── lib/             # Utilities
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the Repository

```bash
cd "Appointment & Queue Manager"
```

### 2. Setup PostgreSQL Database

```bash
# Create database
createdb appointment_queue_db

# Or using psql
psql -c "CREATE DATABASE appointment_queue_db;"
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
npm run db:push

# Start development server
npm run dev
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

### Demo Credentials

On the login page, click "Fill Demo Credentials" then create an account with:

- Email: demo@example.com
- Password: demo123

## 📡 API Endpoints

### Authentication

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | `/api/auth/signup` | Register new user |
| POST   | `/api/auth/login`  | Login user        |
| GET    | `/api/auth/me`     | Get current user  |

### Staff

| Method | Endpoint         | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/staff`     | List all staff |
| POST   | `/api/staff`     | Create staff   |
| PUT    | `/api/staff/:id` | Update staff   |
| DELETE | `/api/staff/:id` | Delete staff   |

### Services

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| GET    | `/api/services`     | List services  |
| POST   | `/api/services`     | Create service |
| PUT    | `/api/services/:id` | Update service |
| DELETE | `/api/services/:id` | Delete service |

### Appointments

| Method | Endpoint                         | Description        |
| ------ | -------------------------------- | ------------------ |
| GET    | `/api/appointments`              | List appointments  |
| POST   | `/api/appointments`              | Create appointment |
| PUT    | `/api/appointments/:id`          | Update appointment |
| DELETE | `/api/appointments/:id`          | Cancel appointment |
| POST   | `/api/appointments/:id/complete` | Mark complete      |

### Queue

| Method | Endpoint                         | Description       |
| ------ | -------------------------------- | ----------------- |
| GET    | `/api/queue`                     | Get waiting queue |
| POST   | `/api/queue/assign`              | Auto-assign       |
| POST   | `/api/queue/:id/assign/:staffId` | Manual assign     |

### Dashboard

| Method | Endpoint                    | Description    |
| ------ | --------------------------- | -------------- |
| GET    | `/api/dashboard/stats`      | Get statistics |
| GET    | `/api/dashboard/staff-load` | Get staff load |

## 🎨 Design System

### Colors

- **Primary**: #4F46E5 (Indigo)
- **Background**: #F7F8FA
- **Surface**: #FFFFFF
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444

### Typography

- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700

## 📝 License

MIT License - feel free to use this project for your portfolio or learning purposes.
