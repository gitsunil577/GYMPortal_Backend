# IronForge Gym — Backend API

Node.js + Express REST API for the IronForge Gym Management System.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Node.js + Express | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| bcryptjs | Password hashing |
| Multer | File / image uploads |
| dotenv | Environment variables |
| CORS | Cross-origin requests |
| Nodemon | Dev auto-restart |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   └── auth.middleware.js      # protect & adminOnly guards
│   ├── models/
│   │   ├── User.js
│   │   ├── Plan.js
│   │   ├── Trainer.js
│   │   ├── Schedule.js
│   │   ├── Subscription.js
│   │   ├── Booking.js
│   │   └── Progress.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── members.controller.js
│   │   ├── plans.controller.js
│   │   ├── trainers.controller.js
│   │   ├── schedules.controller.js
│   │   └── user.controller.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── members.routes.js
│   │   ├── plans.routes.js
│   │   ├── trainers.routes.js
│   │   ├── schedules.routes.js
│   │   └── user.routes.js
│   ├── seed.js                    # Database seeder
│   └── server.js                  # App entry point (port 5000)
└── uploads/                       # Uploaded files (multer)
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT |

### Plans — `/api/plans`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all plans |
| POST | `/` | Admin | Create a plan |
| PUT | `/:id` | Admin | Update a plan |
| DELETE | `/:id` | Admin | Delete a plan |

### Members — `/api/members`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Admin | Get all members |
| GET | `/:id` | Admin | Get member by ID |
| PUT | `/:id` | Admin | Update member |
| DELETE | `/:id` | Admin | Delete member |

### Trainers — `/api/trainers`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all trainers |
| POST | `/` | Admin | Add a trainer |
| PUT | `/:id` | Admin | Update a trainer |
| DELETE | `/:id` | Admin | Delete a trainer |

### Schedules — `/api/schedules`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | User | Get all schedules |
| POST | `/` | Admin | Create a schedule |
| PUT | `/:id` | Admin | Update a schedule |
| DELETE | `/:id` | Admin | Delete a schedule |

### User — `/api/user`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/profile` | User | Get own profile |
| PUT | `/profile` | User | Update own profile |

### Admin — `/api/admin`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard` | Admin | Dashboard stats |
| GET | `/subscriptions` | Admin | All subscriptions |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ironforge_gym
JWT_SECRET=your_super_secret_key
```

### Scripts

```bash
npm run dev     # Start with nodemon (development)
npm start       # Start with node (production)
```

### Seed the Database

Populate the database with sample data (plans, trainers, admin user):

```bash
node src/seed.js
```

Default seeded admin credentials:
- **Email:** admin@gym.com
- **Password:** admin123

---

## Middleware

| Middleware | Description |
|-----------|-------------|
| `protect` | Verifies JWT — blocks unauthenticated requests |
| `adminOnly` | Restricts route to users with `role: admin` |

---

## Models

| Model | Key Fields |
|-------|-----------|
| User | name, email, phone, password, gender, age, role, status |
| Plan | name, duration, price, features |
| Trainer | name, specialty, experience, bio, image |
| Schedule | title, level, day, time, trainer |
| Subscription | user, plan, startDate, endDate, status |
| Booking | user, trainer, date, status |
| Progress | user, weight, bodyFat, notes, date |
