# 🔧 Maintenance Dashboard — Tool Management System

A professional enterprise-grade Tool Management System for tracking tools, parts, and inventory with real-time IN/OUT logging, role-based access, image attachments, and comprehensive reporting.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Auth | JWT + bcrypt |
| File Upload | Multer |
| HTTP Client | Axios |

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **MySQL** 8.0+ ([download](https://dev.mysql.com/downloads/))
- **npm** (comes with Node.js)

## Setup Instructions

### 1. Clone / Navigate to project

```bash
cd tool-management-system
```

### 2. Setup Database

Open MySQL Workbench or command-line client and run:

```bash
mysql -u root -p < backend/database.sql
```

Or copy-paste the contents of `backend/database.sql` into your MySQL client.

### 3. Configure Environment

Edit `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tool_management
JWT_SECRET=tms_super_secret_jwt_key_2025_enterprise
PORT=5000
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Seed Sample Users

```bash
npm run seed
```

This creates the admin and staff accounts with hashed passwords.

### 6. Start Backend Server

```bash
npm run dev
```

Backend will run at: **http://localhost:5000**

### 7. Install Frontend Dependencies (new terminal)

```bash
cd frontend
npm install
```

### 8. Start Frontend Dev Server

```bash
npm run dev
```

Frontend will run at: **http://localhost:5173**

### 9. Open in Browser

Navigate to: **http://localhost:5173**

## Sample Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@company.com | Admin@123 |
| **Staff** | staff@company.com | Staff@123 |

## Features

### 📊 Dashboard
- Real-time stats: Total / IN / OUT / Damaged / Available tools
- Recent IN/OUT activity feed (last 8 entries)

### 📦 Part Management
- Full CRUD with image upload support
- Photo thumbnails with lightbox preview
- Status badges (Available / Out / Damaged)

### 🔧 Tools Management
- Full CRUD with linked parts
- Status tracking (IN / OUT / Damaged)

### 🔄 Tool IN/OUT Entry
- **Issue Tool** — Mark tools as OUT with employee name
- **Return Tool** — Mark tools as IN with condition check
- **History Log** — Complete audit trail with pagination

### 🔍 Search System
- Search by Part Number, Tool Name, or Part Name
- Instant results with Enter key support

### 📈 Reports
- **Daily Report** — Today's activity with stats
- **Monthly Report** — Per-tool summary with totals
- Export to PDF via browser print

## Role-Based Access

| Feature | Admin | Staff |
|---|---|---|
| View Dashboard | ✅ | ✅ |
| View Parts/Tools | ✅ | ✅ |
| Add/Edit/Delete Parts | ✅ | ❌ |
| Add/Edit/Delete Tools | ✅ | ❌ |
| Issue/Return Tools | ✅ | ✅ |
| View Reports | ✅ | ❌ |
| Register Users | ✅ | ❌ |

## API Endpoints

| Method | Endpoint | Auth | Admin Only |
|---|---|---|---|
| POST | /api/auth/register | ❌ | — |
| POST | /api/auth/login | ❌ | — |
| GET | /api/parts | ✅ | ❌ |
| POST | /api/parts | ✅ | ✅ |
| PUT | /api/parts/:id | ✅ | ✅ |
| DELETE | /api/parts/:id | ✅ | ✅ |
| GET | /api/tools | ✅ | ❌ |
| POST | /api/tools | ✅ | ✅ |
| PUT | /api/tools/:id | ✅ | ✅ |
| DELETE | /api/tools/:id | ✅ | ✅ |
| GET | /api/inout | ✅ | ❌ |
| POST | /api/inout/issue | ✅ | ❌ |
| POST | /api/inout/return | ✅ | ❌ |
| GET | /api/search | ✅ | ❌ |
| GET | /api/reports/daily | ✅ | ✅ |
| GET | /api/reports/monthly | ✅ | ✅ |
| GET | /api/dashboard/stats | ✅ | ❌ |

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens expire after 8 hours
- All API routes protected with JWT middleware
- File upload validation (type + size) on backend
- Parameterized SQL queries (no SQL injection)
- CORS restricted to frontend origin

## Project Structure

```
tool-management-system/
├── README.md
├── backend/
│   ├── .env
│   ├── package.json
│   ├── database.sql
│   ├── server.js
│   ├── seed.js
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── parts.js
│   │   ├── tools.js
│   │   ├── inout.js
│   │   ├── search.js
│   │   ├── reports.js
│   │   └── dashboard.js
│   └── uploads/
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── Header.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── Toast.jsx
        │   ├── Modal.jsx
        │   ├── StatCard.jsx
        │   ├── StatusBadge.jsx
        │   └── Lightbox.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Parts.jsx
            ├── Tools.jsx
            ├── InOut.jsx
            ├── Search.jsx
            └── Reports.jsx
```

## License

Internal Enterprise Application — All Rights Reserved.
