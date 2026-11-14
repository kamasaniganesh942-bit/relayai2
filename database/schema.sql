-- ============================================================================
-- RELAY AI — Complete Supabase PostgreSQL Schema
-- ============================================================================
-- Run this file first in the Supabase SQL Editor to create all tables,
-- indexes, and constraints.
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";     -- case-insensitive emails

-- ============================================================================
-- 1. ORGANIZATIONS
-- ============================================================================
CREATE TABLE organizations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    settings    JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_organizations_slug ON organizations (slug);

-- ============================================================================
-- 2. USERS
-- ============================================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email         CITEXT NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    role          VARCHAR(20) NOT NULL CHECK (role IN ('super_admin','org_admin','dept_manager','employee')),
    avatar_url    VARCHAR(500),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_org_id    ON users (org_id);
CREATE INDEX idx_users_email     ON users (email);
CREATE INDEX idx_users_role      ON users (role);
CREATE INDEX idx_users_is_active ON users (is_active);

-- ============================================================================
-- 3. DEPARTMENTS
-- ============================================================================
CREATE TABLE departments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    manager_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_departments_org_id     ON departments (org_id);
CREATE INDEX idx_departments_manager_id ON departments (manager_id);

-- ============================================================================
-- 4. DEPARTMENT MEMBERS
-- ============================================================================
CREATE TABLE department_members (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dept_id   UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role      VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (dept_id, user_id)
);

CREATE INDEX idx_dept_members_dept_id ON department_members (dept_id);
CREATE INDEX idx_dept_members_user_id ON department_members (user_id);

-- ============================================================================
-- 5. REQUESTS
-- ============================================================================
CREATE TABLE requests (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id            UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title             VARCHAR(500) NOT NULL,
    description       TEXT,
    submitted_by      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status            VARCHAR(30) NOT NULL DEFAULT 'new'
                          CHECK (status IN ('new','under_review','approved','in_progress',
                                            'waiting_info','completed','rejected','cancelled')),
    priority          VARCHAR(10) NOT NULL DEFAULT 'medium'
                          CHECK (priority IN ('critical','high','medium','low')),
    category          VARCHAR(100),
    ai_classification JSONB,
    assigned_dept     UUID REFERENCES departments(id) ON DELETE SET NULL,
    assigned_to       UUID REFERENCES users(id) ON DELETE SET NULL,
    deadline          TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_org_id       ON requests (org_id);
CREATE INDEX idx_requests_status       ON requests (status);
CREATE INDEX idx_requests_priority     ON requests (priority);
CREATE INDEX idx_requests_submitted_by ON requests (submitted_by);
CREATE INDEX idx_requests_assigned_to  ON requests (assigned_to);
CREATE INDEX idx_requests_assigned_dept ON requests (assigned_dept);
CREATE INDEX idx_requests_created_at   ON requests (created_at DESC);

-- ============================================================================
-- 6. TASKS
-- ============================================================================
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    request_id      UUID REFERENCES requests(id) ON DELETE SET NULL,
    title           VARCHAR(500) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new','under_review','assigned','in_progress',
                                          'waiting_approval','blocked','completed','rejected')),
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('critical','high','medium','low')),
    assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    dept_id         UUID REFERENCES departments(id) ON DELETE SET NULL,
    deadline        TIMESTAMPTZ,
    estimated_hours NUMERIC(6,2),
    actual_hours    NUMERIC(6,2),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_org_id      ON tasks (org_id);
CREATE INDEX idx_tasks_request_id  ON tasks (request_id);
CREATE INDEX idx_tasks_status      ON tasks (status);
CREATE INDEX idx_tasks_priority    ON tasks (priority);
CREATE INDEX idx_tasks_assigned_to ON tasks (assigned_to);
CREATE INDEX idx_tasks_dept_id     ON tasks (dept_id);
CREATE INDEX idx_tasks_created_at  ON tasks (created_at DESC);

-- ============================================================================
-- 7. TASK DEPENDENCIES
-- ============================================================================
CREATE TABLE task_dependencies (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id           UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    status            VARCHAR(20) NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','met','waived')),
    UNIQUE (task_id, depends_on_task_id),
    CHECK  (task_id <> depends_on_task_id)
);

CREATE INDEX idx_task_deps_task_id    ON task_dependencies (task_id);
CREATE INDEX idx_task_deps_depends_on ON task_dependencies (depends_on_task_id);

-- ============================================================================
-- 8. COMMENTS
-- ============================================================================
CREATE TABLE comments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(10) NOT NULL CHECK (entity_type IN ('task','request')),
    entity_id   UUID NOT NULL,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_entity   ON comments (entity_type, entity_id);
CREATE INDEX idx_comments_user_id  ON comments (user_id);

-- ============================================================================
-- 9. ATTACHMENTS
-- ============================================================================
CREATE TABLE attachments (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(10) NOT NULL CHECK (entity_type IN ('task','request')),
    entity_id   UUID NOT NULL,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name   VARCHAR(500) NOT NULL,
    file_url    VARCHAR(1000) NOT NULL,
    file_size   BIGINT,
    mime_type   VARCHAR(100),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_attachments_entity  ON attachments (entity_type, entity_id);
CREATE INDEX idx_attachments_user_id ON attachments (user_id);

-- ============================================================================
-- 10. APPROVALS
-- ============================================================================
CREATE TABLE approvals (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type   VARCHAR(10) NOT NULL CHECK (entity_type IN ('task','request')),
    entity_id     UUID NOT NULL,
    requested_by  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status        VARCHAR(10) NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','approved','rejected')),
    decision_note TEXT,
    decided_at    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_approvals_org_id       ON approvals (org_id);
CREATE INDEX idx_approvals_entity       ON approvals (entity_type, entity_id);
CREATE INDEX idx_approvals_assigned_to  ON approvals (assigned_to);
CREATE INDEX idx_approvals_status       ON approvals (status);

-- ============================================================================
-- 11. NOTIFICATIONS
-- ============================================================================
CREATE TABLE notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id     UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50) NOT NULL,
    title      VARCHAR(255) NOT NULL,
    message    TEXT,
    is_read    BOOLEAN NOT NULL DEFAULT false,
    link       VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_org_id     ON notifications (org_id);
CREATE INDEX idx_notifications_user_id    ON notifications (user_id);
CREATE INDEX idx_notifications_is_read    ON notifications (user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications (created_at DESC);

-- ============================================================================
-- 12. WORKFLOW RULES
-- ============================================================================
CREATE TABLE workflow_rules (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    trigger_event VARCHAR(100) NOT NULL,
    conditions    JSONB DEFAULT '[]'::jsonb,
    actions       JSONB DEFAULT '[]'::jsonb,
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workflow_rules_org_id    ON workflow_rules (org_id);
CREATE INDEX idx_workflow_rules_is_active ON workflow_rules (org_id, is_active);

-- ============================================================================
-- 13. AUTOMATION LOGS
-- ============================================================================
CREATE TABLE automation_logs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id           UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    rule_id          UUID NOT NULL REFERENCES workflow_rules(id) ON DELETE CASCADE,
    trigger_data     JSONB,
    actions_executed JSONB,
    status           VARCHAR(20) NOT NULL DEFAULT 'success'
                         CHECK (status IN ('success','failure','partial')),
    error_message    TEXT,
    executed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_automation_logs_org_id  ON automation_logs (org_id);
CREATE INDEX idx_automation_logs_rule_id ON automation_logs (rule_id);
CREATE INDEX idx_automation_logs_status  ON automation_logs (status);

-- ============================================================================
-- 14. AI ANALYSIS RECORDS
-- ============================================================================
CREATE TABLE ai_analysis_records (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id        UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    entity_type   VARCHAR(20) NOT NULL,
    entity_id     UUID NOT NULL,
    analysis_type VARCHAR(50) NOT NULL,
    result        JSONB NOT NULL,
    model_used    VARCHAR(100),
    tokens_used   INT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_analysis_org_id ON ai_analysis_records (org_id);
CREATE INDEX idx_ai_analysis_entity ON ai_analysis_records (entity_type, entity_id);
CREATE INDEX idx_ai_analysis_type   ON ai_analysis_records (analysis_type);

-- ============================================================================
-- 15. REPORTS
-- ============================================================================
CREATE TABLE reports (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id       UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    generated_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_type  VARCHAR(50) NOT NULL,
    title        VARCHAR(255) NOT NULL,
    content      JSONB,
    parameters   JSONB,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_org_id       ON reports (org_id);
CREATE INDEX idx_reports_generated_by ON reports (generated_by);
CREATE INDEX idx_reports_type         ON reports (report_type);

-- ============================================================================
-- 16. AUDIT LOGS
-- ============================================================================
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   UUID,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_org_id      ON audit_logs (org_id);
CREATE INDEX idx_audit_logs_user_id     ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity      ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_action      ON audit_logs (action);
CREATE INDEX idx_audit_logs_created_at  ON audit_logs (created_at DESC);

-- ============================================================================
-- 17. CONVERSATION HISTORY
-- ============================================================================
CREATE TABLE conversation_history (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id     UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       VARCHAR(20) NOT NULL CHECK (role IN ('user','assistant','system')),
    content    TEXT NOT NULL,
    context    JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversation_org_id    ON conversation_history (org_id);
CREATE INDEX idx_conversation_user_id   ON conversation_history (user_id);
CREATE INDEX idx_conversation_created   ON conversation_history (created_at DESC);

-- ============================================================================
-- TRIGGER: Auto-update updated_at columns
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_requests_updated_at
    BEFORE UPDATE ON requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) — Supabase best-practice tenant isolation
-- ============================================================================
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_dependencies  ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_rules     ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports            ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_history ENABLE ROW LEVEL SECURITY;

-- NOTE: Concrete RLS policies should be defined per your auth strategy.
-- The backend service role bypasses RLS by default in Supabase.

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
