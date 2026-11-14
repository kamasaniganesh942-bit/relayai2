# RELAY AI

> **Connecting People, Departments and Decisions Through Intelligence.**

RELAY AI is an enterprise workflow intelligence and coordination platform. Built with React, Node.js, Supabase PostgreSQL, and Google Gemini AI, it acts as the operational nervous system for organizations — eliminating silos, predicting bottlenecks, automating routing, and empowering leadership with actionable intelligence.

---

## 🌟 Key Capabilities

### 1. Workflow Intelligence
- **Semantic Request Understanding:** Analyzes unstructured business requests using Google Gemini to classify category, urgency, priority, and required next steps.
- **Autonomous Department Routing:** Matches work items to suitable departments based on skill sets, current member workloads, and organizational policies.
- **Task & Kanban Orchestration:** Full lifecycle management across 8 discrete statuses (`new`, `under_review`, `assigned`, `in_progress`, `waiting_approval`, `blocked`, `completed`, `rejected`).
- **Configurable Workflow Engine:** Define event-triggered automations (`WHEN request_created THEN notify_manager AND set_sla_hours`).

### 2. Enterprise Intelligence
- **Operational Bottleneck Detection:** Continuously detects stalled approvals, cross-department dependencies, and overloaded queues.
- **Predictive Delay Forecasting:** Calculates statistical risk probabilities and days of delay for in-flight tasks before SLA breaches occur.
- **RELAY INTELLIGENCE Assistant:** Context-aware conversational AI querying live database records to answer leadership queries.
- **AI Executive Reports:** Compiles daily operational summaries, weekly retrospectives, and monthly bottleneck audits in seconds.

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Recharts |
| **Backend** | Node.js, Express.js, REST Architecture, JWT, bcryptjs, Zod, Helmet, Morgan |
| **Database** | Supabase PostgreSQL (Normalized Relational Schema with Multi-Tenant Isolation) |
| **Artificial Intelligence** | Google Gemini API (`gemini-1.5-flash` / `gemini-1.5-pro`) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- npm or pnpm

### 1. Clone & Configure Environment

#### Backend:
```bash
cd backend
cp .env.example .env
npm install
```

Configure `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_jwt_secret_here

# (Optional) Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# (Optional) Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
```

> **Zero-Config Demo Mode:** If Supabase credentials are not provided, RELAY AI automatically initializes an **in-memory database pre-loaded with Acme Corporation's full dataset**, allowing immediate offline evaluation and testing.

#### Frontend:
```bash
cd frontend
cp .env.example .env
npm install
```

### 2. Run the Application

In terminal 1 (Backend):
```bash
cd backend
node src/index.js
```

In terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 👥 Demo Accounts (Acme Corporation)

Password for all demo accounts: `Demo123!`

| Role | Name | Email |
|---|---|---|
| **Super Admin** | Sarah Chen | `admin@acme-demo.com` |
| **Org Admin** | James Wilson | `james.wilson@acme-demo.com` |
| **IT Manager** | Lisa Tanaka | `lisa.tanaka@acme-demo.com` |
| **Finance Manager** | Michael Okonkwo | `michael.okonkwo@acme-demo.com` |
| **HR Manager** | Priya Sharma | `priya.sharma@acme-demo.com` |
| **Senior Engineer** | David Park | `david.park@acme-demo.com` |
| **Sales Specialist** | Elena Rostova | `elena.rostova@acme-demo.com` |
| **Logistics Lead** | Marcus Brody | `marcus.brody@acme-demo.com` |

*Tip: Use the 1-click Quick Demo login buttons on the login screen to sign in as any role immediately.*

---

## 🔌 API Architecture & Endpoints

| Route | Description |
|---|---|
| `POST /api/auth/login` | User authentication & JWT issuance |
| `POST /api/auth/register` | Organization & admin registration |
| `GET /api/requests` | List business requests with filters |
| `POST /api/requests` | Submit new request with AI classification |
| `GET /api/tasks` | List tasks with filters & pagination |
| `GET /api/tasks/kanban` | Categorized kanban pipeline |
| `POST /api/ai/analyze` | Gemini semantic request understanding |
| `POST /api/ai/assistant` | Conversational query execution with DB context |
| `GET /api/ai/insights` | Operational bottleneck & delay predictions |
| `POST /api/reports/generate` | AI executive management report generation |
| `GET /api/workflows` | Configurable event-driven automation rules |
| `GET /api/notifications` | Real-time user alert feed |
| `GET /api/analytics/dashboard` | High-level organizational KPI metrics |

---

## 🔒 Security & Multi-Tenancy

- **Strict Tenant Isolation:** All SQL queries enforce `WHERE org_id = req.user.org_id`.
- **Backend-Only AI Execution:** Gemini API key resides solely on the backend; never exposed to clients.
- **Role-Based Access Control (RBAC):** Backend route middleware enforces permission boundaries (`super_admin`, `org_admin`, `dept_manager`, `employee`).
- **Data Protection:** bcrypt 10-round hashing, helmet security headers, rate limiting, and parameter validation using Zod.

---

## 🌐 Production Deployment

- **Frontend:** Deploy to **Vercel** with build command `npm run build` and output directory `dist`.
- **Backend:** Deploy to **Render** or **Railway** with start command `node src/index.js`.
- **Database:** Deploy schema via **Supabase PostgreSQL** SQL editor using [`database/schema.sql`](file:///c:/Users/manju/OneDrive/Desktop/New%20folder%20(2)/kea/relay%20ai/database/schema.sql).

---

&copy; 2026 RELAY AI Inc. All rights reserved.

