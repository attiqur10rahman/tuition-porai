# Tuition Porai — Full Stack Tuition Management System

A professional web app for Bangladeshi tutors to manage students, track payments, and monitor income.

---

## 🚀 Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 + Vite + React Router v6   |
| Backend  | Node.js + Express.js                |
| Database | MongoDB + Mongoose                  |
| Charts   | Recharts                            |

---

## 📦 Prerequisites

Before running, make sure you have installed:
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) (local) OR a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

## ⚙️ Setup & Run

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set your MONGODB_URI
npm run dev
```

Backend runs at: `http://localhost:5000`

### 2. Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 🗂️ Project Structure

```
tuition-porai/
├── backend/
│   ├── server.js          ← Express entry point
│   ├── models/
│   │   ├── Student.js
│   │   ├── Payment.js
│   │   ├── Batch.js
│   │   └── Profile.js
│   └── routes/
│       ├── students.js
│       ├── payments.js
│       ├── batches.js
│       ├── reports.js
│       └── profile.js
└── frontend/
    └── src/
        ├── App.jsx        ← All routes
        ├── api.js         ← Axios API calls
        ├── pages/
        │   ├── Dashboard.jsx
        │   ├── Students.jsx
        │   ├── StudentDetail.jsx
        │   ├── AddStudent.jsx
        │   ├── Reports.jsx
        │   ├── Batches.jsx
        │   └── Settings.jsx
        └── components/
            ├── Layout.jsx
            └── ui.jsx     ← Shared components
```

---

## 🌟 Pages

| Page            | Path              | Description                        |
|-----------------|-------------------|------------------------------------|
| Dashboard       | `/`               | Overview, stats, quick actions     |
| Students List   | `/students`       | All students with search & filter  |
| Add Student     | `/students/add`   | 3-step registration form           |
| Student Profile | `/students/:id`   | Profile, record/view payments      |
| Reports         | `/reports`        | Financial summary, dues, bar chart |
| Batches         | `/batches`        | Create and manage student groups   |
| Settings        | `/settings`       | Tutor profile & monthly target     |

---

## 🌐 API Endpoints

| Method | Endpoint                   | Description              |
|--------|----------------------------|--------------------------|
| GET    | /api/students              | All students             |
| POST   | /api/students              | Create student           |
| GET    | /api/students/:id          | Student with payments    |
| PUT    | /api/students/:id          | Update student           |
| DELETE | /api/students/:id          | Delete student           |
| GET    | /api/payments              | Recent payments          |
| POST   | /api/payments              | Record payment           |
| DELETE | /api/payments/:id          | Delete payment           |
| GET    | /api/batches               | All batches              |
| POST   | /api/batches               | Create batch             |
| PUT    | /api/batches/:id           | Update batch             |
| DELETE | /api/batches/:id           | Delete batch             |
| GET    | /api/reports/summary       | Monthly financial summary|
| GET    | /api/reports/monthly       | 6-month trend data       |
| GET    | /api/reports/dues          | Per-student dues report  |
| GET    | /api/profile               | Get tutor profile        |
| PUT    | /api/profile               | Update profile           |

---

## 🚀 Deploy to Production

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Upload dist/ folder to Vercel or Netlify
```

### Backend (Render/Railway)
- Set env var `MONGODB_URI` to your Atlas connection string
- Set `PORT` if needed

---

Made with ❤️ for Bangladeshi tutors · Currency: ৳ BDT
