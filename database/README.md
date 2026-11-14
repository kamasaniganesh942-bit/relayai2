# RELAY AI — Database Setup & Architecture Guide

RELAY AI utilizes a normalized multi-tenant relational schema hosted on **Supabase PostgreSQL**.

---

## 1. Quick Setup in Supabase

1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **SQL Editor** tab.
3. Open and run [`database/schema.sql`](file:///c:/Users/manju/OneDrive/Desktop/New%20folder%20(2)/kea/relay%20ai/database/schema.sql) to instantiate all tables, relational foreign keys, performance indexes, and automatic timestamp triggers.
4. Run [`database/seed.sql`](file:///c:/Users/manju/OneDrive/Desktop/New%20folder%20(2)/kea/relay%20ai/database/seed.sql) to populate the demo organization **Acme Corporation** with 5 operational departments, 8 role-differentiated users, and active requests/tasks.

---

## 2. Environment Variables Configuration

Copy your Supabase project API keys into `backend/.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
```

> **Note:** Always use the `SUPABASE_SERVICE_ROLE_KEY` in the backend so authorization and tenant isolation rules are enforced server-side. Never expose the service role key in frontend repositories.

---

## 3. Relational Schema Architecture

| Table | Purpose | Tenant Key |
|---|---|---|
| `organizations` | Tenant isolation boundary & settings | `id` (PK) |
| `users` | Multi-role user accounts with bcrypt hashes | `org_id` |
| `departments` | Organizational business units (HR, IT, Finance) | `org_id` |
| `department_members`| Many-to-many user-to-department mappings | `dept_id` |
| `requests` | Incoming employee business requests | `org_id` |
| `tasks` | Actionable execution items & tickets | `org_id` |
| `task_dependencies`| Cross-task bottleneck mapping | N/A (FKs) |
| `comments` | Activity feed and cross-unit discussion | `org_id` |
| `attachments` | Document metadata and attachments | `org_id` |
| `approvals` | Formal gate-keeping workflows | `org_id` |
| `notifications` | In-app alerts, SLA warnings, and mentions | `org_id` |
| `workflow_rules` | Configurable event-driven automation rules | `org_id` |
| `automation_logs` | Audit trail of triggered automations | `org_id` |
| `ai_analysis_records` | Google Gemini inference telemetry & audit | `org_id` |
| `reports` | Executive and management compiled briefs | `org_id` |
| `audit_logs` | Security and compliance audit trail | `org_id` |
| `conversation_history`| RELAY INTELLIGENCE assistant chats | `org_id` |

---

## 4. Multi-Tenant Isolation

All queries from backend route handlers strictly filter by `org_id` extracted from the cryptographically verified JWT token (`req.user.org_id`). This ensures zero cross-organization leakage.

