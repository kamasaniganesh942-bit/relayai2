-- ============================================================================
-- RELAY AI — Seed Data
-- ============================================================================
-- Run this AFTER schema.sql in the Supabase SQL Editor.
-- Password for ALL demo users: Demo123!
-- Hash placeholder: $2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
-- ============================================================================

-- ===================== ORGANIZATION =====================
INSERT INTO organizations (id, name, slug, settings) VALUES
    ('a0000000-0000-0000-0000-000000000001',
     'Acme Corporation',
     'acme-demo',
     '{"theme":"default","ai_enabled":true,"max_users":50,"features":["ai_classification","workflow_automation","reports"]}'::jsonb);

-- ===================== USERS (8) =====================
-- Roles: super_admin(1), org_admin(1), dept_manager(3), employee(3)
INSERT INTO users (id, org_id, email, password_hash, first_name, last_name, role, is_active) VALUES
    -- Super Admin
    ('b0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000001',
     'admin@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'Sarah', 'Chen', 'super_admin', true),

    -- Org Admin
    ('b0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000001',
     'james.wilson@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'James', 'Wilson', 'org_admin', true),

    -- Dept Manager — HR
    ('b0000000-0000-0000-0000-000000000003',
     'a0000000-0000-0000-0000-000000000001',
     'priya.sharma@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'Priya', 'Sharma', 'dept_manager', true),

    -- Dept Manager — Finance
    ('b0000000-0000-0000-0000-000000000004',
     'a0000000-0000-0000-0000-000000000001',
     'michael.okonkwo@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'Michael', 'Okonkwo', 'dept_manager', true),

    -- Dept Manager — IT
    ('b0000000-0000-0000-0000-000000000005',
     'a0000000-0000-0000-0000-000000000001',
     'lisa.tanaka@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'Lisa', 'Tanaka', 'dept_manager', true),

    -- Employee — Sales
    ('b0000000-0000-0000-0000-000000000006',
     'a0000000-0000-0000-0000-000000000001',
     'carlos.rivera@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'Carlos', 'Rivera', 'employee', true),

    -- Employee — Operations
    ('b0000000-0000-0000-0000-000000000007',
     'a0000000-0000-0000-0000-000000000001',
     'emma.johnson@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'Emma', 'Johnson', 'employee', true),

    -- Employee — IT
    ('b0000000-0000-0000-0000-000000000008',
     'a0000000-0000-0000-0000-000000000001',
     'raj.patel@acme-demo.com',
     '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
     'Raj', 'Patel', 'employee', true);

-- ===================== DEPARTMENTS (5) =====================
INSERT INTO departments (id, org_id, name, description, manager_id) VALUES
    ('c0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000001',
     'Human Resources',
     'Employee relations, recruitment, onboarding, benefits and compliance',
     'b0000000-0000-0000-0000-000000000003'),

    ('c0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000001',
     'Finance',
     'Budgeting, accounts payable/receivable, financial reporting and auditing',
     'b0000000-0000-0000-0000-000000000004'),

    ('c0000000-0000-0000-0000-000000000003',
     'a0000000-0000-0000-0000-000000000001',
     'IT',
     'Infrastructure, software development, security, helpdesk and technical support',
     'b0000000-0000-0000-0000-000000000005'),

    ('c0000000-0000-0000-0000-000000000004',
     'a0000000-0000-0000-0000-000000000001',
     'Sales',
     'Client acquisition, account management, revenue operations and CRM',
     'b0000000-0000-0000-0000-000000000002'),  -- James doubles as Sales lead

    ('c0000000-0000-0000-0000-000000000005',
     'a0000000-0000-0000-0000-000000000001',
     'Operations',
     'Process optimization, logistics, facilities management and vendor relations',
     'b0000000-0000-0000-0000-000000000001');  -- Sarah as interim Ops lead

-- ===================== DEPARTMENT MEMBERS =====================
INSERT INTO department_members (dept_id, user_id, role) VALUES
    -- HR
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'manager'),
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'member'),
    -- Finance
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004', 'manager'),
    -- IT
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 'manager'),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000008', 'member'),
    -- Sales
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'manager'),
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000006', 'member'),
    -- Operations
    ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'manager');

-- ===================== REQUESTS (16) =====================
INSERT INTO requests (id, org_id, title, description, submitted_by, status, priority, category, ai_classification, assigned_dept, assigned_to, deadline) VALUES
    -- 1 — New / Critical
    ('d0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000001',
     'VPN access not working for remote employees',
     'Multiple remote employees report VPN connection drops every 10-15 minutes since the firewall update last Friday. Affects approximately 30 staff members.',
     'b0000000-0000-0000-0000-000000000007',
     'in_progress', 'critical', 'IT Support',
     '{"category":"IT Support","confidence":0.97,"suggested_dept":"IT","urgency":"critical","tags":["vpn","networking","remote-work"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000008',
     NOW() + INTERVAL '2 days'),

    -- 2 — Under review / High
    ('d0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000001',
     'Budget approval for Q2 marketing campaign',
     'Requesting $45,000 budget for the Q2 digital marketing campaign targeting enterprise clients. Includes Google Ads, LinkedIn sponsored content, and a webinar series.',
     'b0000000-0000-0000-0000-000000000006',
     'under_review', 'high', 'Budget',
     '{"category":"Budget","confidence":0.92,"suggested_dept":"Finance","urgency":"high","tags":["budget","marketing","Q2"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000004',
     NOW() + INTERVAL '7 days'),

    -- 3 — Completed / Medium
    ('d0000000-0000-0000-0000-000000000003',
     'a0000000-0000-0000-0000-000000000001',
     'New employee onboarding — Alex Kim',
     'Please initiate onboarding for Alex Kim, starting as a Junior Developer on the 15th. Need laptop, email, building access, and orientation schedule.',
     'b0000000-0000-0000-0000-000000000005',
     'completed', 'medium', 'Onboarding',
     '{"category":"HR - Onboarding","confidence":0.95,"suggested_dept":"HR","urgency":"medium","tags":["onboarding","new-hire"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000003',
     NOW() - INTERVAL '3 days'),

    -- 4 — New / Low
    ('d0000000-0000-0000-0000-000000000004',
     'a0000000-0000-0000-0000-000000000001',
     'Update company logo on internal wiki',
     'The rebrand was finalized last month. The internal wiki, Confluence, and email signatures still show the old logo. Please update across all platforms.',
     'b0000000-0000-0000-0000-000000000002',
     'new', 'low', 'Branding',
     '{"category":"Branding","confidence":0.88,"suggested_dept":"IT","urgency":"low","tags":["branding","wiki","logo"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000003',
     NULL,
     NOW() + INTERVAL '30 days'),

    -- 5 — Approved / High
    ('d0000000-0000-0000-0000-000000000005',
     'a0000000-0000-0000-0000-000000000001',
     'Office AC repair — 3rd floor',
     'The AC unit on the 3rd floor has been malfunctioning for 3 days. Temperature reached 32°C yesterday. Staff are unable to work comfortably.',
     'b0000000-0000-0000-0000-000000000007',
     'approved', 'high', 'Facilities',
     '{"category":"Facilities","confidence":0.94,"suggested_dept":"Operations","urgency":"high","tags":["facilities","HVAC","maintenance"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000005',
     'b0000000-0000-0000-0000-000000000001',
     NOW() + INTERVAL '1 day'),

    -- 6 — In progress / Medium
    ('d0000000-0000-0000-0000-000000000006',
     'a0000000-0000-0000-0000-000000000001',
     'Annual performance review template updates',
     'HR needs to revise the annual performance review template to include OKR-based evaluation metrics for the upcoming review cycle starting next month.',
     'b0000000-0000-0000-0000-000000000003',
     'in_progress', 'medium', 'HR Process',
     '{"category":"HR","confidence":0.96,"suggested_dept":"HR","urgency":"medium","tags":["performance-review","HR","templates"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '14 days'),

    -- 7 — Waiting info / Medium
    ('d0000000-0000-0000-0000-000000000007',
     'a0000000-0000-0000-0000-000000000001',
     'Vendor contract renewal — CloudHost Pro',
     'Our CloudHost Pro contract expires in 45 days. Need to evaluate whether to renew at current rates or switch to the competitor offer from AzureStack.',
     'b0000000-0000-0000-0000-000000000005',
     'waiting_info', 'medium', 'Procurement',
     '{"category":"Procurement","confidence":0.89,"suggested_dept":"Finance","urgency":"medium","tags":["vendor","contract","cloud"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000004',
     NOW() + INTERVAL '30 days'),

    -- 8 — Rejected / Low
    ('d0000000-0000-0000-0000-000000000008',
     'a0000000-0000-0000-0000-000000000001',
     'Standing desks for the entire sales team',
     'Request standing desks for all 12 members of the sales team. Estimated cost: $6,000.',
     'b0000000-0000-0000-0000-000000000006',
     'rejected', 'low', 'Facilities',
     '{"category":"Facilities","confidence":0.91,"suggested_dept":"Operations","urgency":"low","tags":["furniture","ergonomics"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000005',
     NULL,
     NULL),

    -- 9 — New / High
    ('d0000000-0000-0000-0000-000000000009',
     'a0000000-0000-0000-0000-000000000001',
     'Data backup verification for compliance audit',
     'The annual SOC 2 compliance audit is in 3 weeks. Need to verify all data backup procedures and generate evidence reports.',
     'b0000000-0000-0000-0000-000000000001',
     'new', 'high', 'Compliance',
     '{"category":"Compliance","confidence":0.93,"suggested_dept":"IT","urgency":"high","tags":["compliance","SOC2","backup","audit"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000005',
     NOW() + INTERVAL '21 days'),

    -- 10 — In progress / Critical
    ('d0000000-0000-0000-0000-000000000010',
     'a0000000-0000-0000-0000-000000000001',
     'Payroll processing error — November cycle',
     'Several employees reported incorrect overtime calculations in their November paychecks. Need immediate investigation and correction before end of week.',
     'b0000000-0000-0000-0000-000000000004',
     'in_progress', 'critical', 'Payroll',
     '{"category":"Payroll","confidence":0.98,"suggested_dept":"Finance","urgency":"critical","tags":["payroll","error","overtime"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000004',
     NOW() + INTERVAL '3 days'),

    -- 11 — New / Medium
    ('d0000000-0000-0000-0000-000000000011',
     'a0000000-0000-0000-0000-000000000001',
     'CRM integration with new email marketing tool',
     'Sales team needs to integrate Salesforce with our new Mailchimp instance for automated lead nurturing campaigns.',
     'b0000000-0000-0000-0000-000000000006',
     'new', 'medium', 'Integration',
     '{"category":"IT - Integration","confidence":0.90,"suggested_dept":"IT","urgency":"medium","tags":["CRM","integration","email"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000003',
     NULL,
     NOW() + INTERVAL '21 days'),

    -- 12 — Under review / High
    ('d0000000-0000-0000-0000-000000000012',
     'a0000000-0000-0000-0000-000000000001',
     'Harassment prevention training — mandatory rollout',
     'Per new state regulations, all employees must complete updated harassment prevention training by end of Q1. Need to procure vendor and schedule sessions.',
     'b0000000-0000-0000-0000-000000000003',
     'under_review', 'high', 'Training',
     '{"category":"HR - Training","confidence":0.94,"suggested_dept":"HR","urgency":"high","tags":["training","compliance","mandatory"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '60 days'),

    -- 13 — Completed / Medium
    ('d0000000-0000-0000-0000-000000000013',
     'a0000000-0000-0000-0000-000000000001',
     'Quarterly sales report — Q3 FY2026',
     'Generate the Q3 FY2026 consolidated sales report with regional breakdowns and YoY comparison.',
     'b0000000-0000-0000-0000-000000000002',
     'completed', 'medium', 'Reporting',
     '{"category":"Reporting","confidence":0.96,"suggested_dept":"Sales","urgency":"medium","tags":["report","sales","Q3"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000004',
     'b0000000-0000-0000-0000-000000000006',
     NOW() - INTERVAL '7 days'),

    -- 14 — In progress / Medium
    ('d0000000-0000-0000-0000-000000000014',
     'a0000000-0000-0000-0000-000000000001',
     'Security patch deployment — CVE-2026-4521',
     'Critical security vulnerability CVE-2026-4521 discovered in OpenSSL. Need to patch all production and staging servers within 48 hours.',
     'b0000000-0000-0000-0000-000000000005',
     'in_progress', 'critical', 'Security',
     '{"category":"Security","confidence":0.99,"suggested_dept":"IT","urgency":"critical","tags":["security","patch","CVE","urgent"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000008',
     NOW() + INTERVAL '2 days'),

    -- 15 — New / Low
    ('d0000000-0000-0000-0000-000000000015',
     'a0000000-0000-0000-0000-000000000001',
     'Team building event planning — December',
     'Plan the annual end-of-year team building event. Budget $5,000, venue needed for 50 people, date TBD in December.',
     'b0000000-0000-0000-0000-000000000007',
     'new', 'low', 'Events',
     '{"category":"Events","confidence":0.87,"suggested_dept":"HR","urgency":"low","tags":["event","team-building","december"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000001',
     NULL,
     NOW() + INTERVAL '45 days'),

    -- 16 — Cancelled / Medium
    ('d0000000-0000-0000-0000-000000000016',
     'a0000000-0000-0000-0000-000000000001',
     'Office relocation feasibility study',
     'Investigate options for relocating the downtown office to a larger space. Cancelled due to lease renewal at current location.',
     'b0000000-0000-0000-0000-000000000001',
     'cancelled', 'medium', 'Facilities',
     '{"category":"Facilities","confidence":0.93,"suggested_dept":"Operations","urgency":"medium","tags":["relocation","office","lease"]}'::jsonb,
     'c0000000-0000-0000-0000-000000000005',
     NULL,
     NULL);

-- ===================== TASKS (22) =====================
INSERT INTO tasks (id, org_id, request_id, title, description, status, priority, assigned_to, assigned_by, dept_id, deadline, estimated_hours, actual_hours) VALUES
    -- Tasks for Request 1 (VPN)
    ('e0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000001',
     'Diagnose VPN connection drops',
     'Analyze firewall logs and VPN server metrics to identify root cause of connection instability after Friday''s update.',
     'in_progress', 'critical',
     'b0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '1 day', 4.00, 2.50),

    ('e0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000001',
     'Roll back firewall rule changes',
     'If root cause is confirmed as the firewall update, revert to the previous rule set and test VPN connectivity.',
     'blocked', 'critical',
     'b0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '2 days', 2.00, NULL),

    -- Tasks for Request 2 (Budget)
    ('e0000000-0000-0000-0000-000000000003',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000002',
     'Review Q2 marketing budget proposal',
     'Analyze the $45K budget breakdown, compare with Q1 ROI, and prepare recommendation for CFO.',
     'under_review', 'high',
     'b0000000-0000-0000-0000-000000000004',
     'b0000000-0000-0000-0000-000000000002',
     'c0000000-0000-0000-0000-000000000002',
     NOW() + INTERVAL '5 days', 3.00, NULL),

    -- Tasks for Request 3 (Onboarding — completed)
    ('e0000000-0000-0000-0000-000000000004',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000003',
     'Provision laptop and accounts for Alex Kim',
     'Set up MacBook Pro, create email, Slack, and GitHub accounts. Install dev tools per standard IT checklist.',
     'completed', 'medium',
     'b0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000003',
     NOW() - INTERVAL '5 days', 3.00, 2.50),

    ('e0000000-0000-0000-0000-000000000005',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000003',
     'Schedule orientation sessions for Alex Kim',
     'Coordinate with department heads for intro sessions during first week. Book conference rooms.',
     'completed', 'medium',
     'b0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000003',
     'c0000000-0000-0000-0000-000000000001',
     NOW() - INTERVAL '4 days', 2.00, 1.50),

    -- Tasks for Request 5 (AC repair)
    ('e0000000-0000-0000-0000-000000000006',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000005',
     'Contact HVAC vendor for emergency repair',
     'Call HVAC vendor (CoolAir Solutions) and schedule emergency visit for 3rd floor AC unit.',
     'completed', 'high',
     'b0000000-0000-0000-0000-000000000001',
     'b0000000-0000-0000-0000-000000000001',
     'c0000000-0000-0000-0000-000000000005',
     NOW(), 1.00, 0.50),

    ('e0000000-0000-0000-0000-000000000007',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000005',
     'Supervise AC unit repair on-site',
     'Be present during HVAC technician visit, verify repair, and confirm proper operation.',
     'assigned', 'high',
     'b0000000-0000-0000-0000-000000000007',
     'b0000000-0000-0000-0000-000000000001',
     'c0000000-0000-0000-0000-000000000005',
     NOW() + INTERVAL '1 day', 3.00, NULL),

    -- Tasks for Request 6 (Performance review)
    ('e0000000-0000-0000-0000-000000000008',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000006',
     'Draft OKR-based evaluation criteria',
     'Research industry best practices for OKR-based performance evaluation and draft new criteria matrix.',
     'in_progress', 'medium',
     'b0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000003',
     'c0000000-0000-0000-0000-000000000001',
     NOW() + INTERVAL '7 days', 8.00, 3.00),

    ('e0000000-0000-0000-0000-000000000009',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000006',
     'Build review template in HR system',
     'Implement the approved OKR template in BambooHR and set up the review cycle workflow.',
     'new', 'medium',
     'b0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000003',
     'c0000000-0000-0000-0000-000000000001',
     NOW() + INTERVAL '12 days', 4.00, NULL),

    -- Tasks for Request 10 (Payroll)
    ('e0000000-0000-0000-0000-000000000010',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000010',
     'Identify affected employees and calculate discrepancies',
     'Pull overtime records from timesheet system, compare against payroll output, and list all affected employees with exact discrepancy amounts.',
     'completed', 'critical',
     'b0000000-0000-0000-0000-000000000004',
     'b0000000-0000-0000-0000-000000000004',
     'c0000000-0000-0000-0000-000000000002',
     NOW() + INTERVAL '1 day', 4.00, 3.50),

    ('e0000000-0000-0000-0000-000000000011',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000010',
     'Process corrective payments',
     'Submit correction batch for all affected employees. Ensure adjustments appear in supplemental pay run.',
     'in_progress', 'critical',
     'b0000000-0000-0000-0000-000000000004',
     'b0000000-0000-0000-0000-000000000004',
     'c0000000-0000-0000-0000-000000000002',
     NOW() + INTERVAL '3 days', 3.00, 1.00),

    -- Tasks for Request 9 (Compliance)
    ('e0000000-0000-0000-0000-000000000012',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000009',
     'Run full backup verification tests',
     'Execute restore tests on all critical databases and document recovery times for SOC 2 evidence.',
     'new', 'high',
     'b0000000-0000-0000-0000-000000000005',
     'b0000000-0000-0000-0000-000000000001',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '14 days', 8.00, NULL),

    ('e0000000-0000-0000-0000-000000000013',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000009',
     'Compile SOC 2 evidence package',
     'Gather backup logs, restore test results, policy documents, and create the evidence binder for auditors.',
     'new', 'high',
     'b0000000-0000-0000-0000-000000000005',
     'b0000000-0000-0000-0000-000000000001',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '18 days', 6.00, NULL),

    -- Tasks for Request 14 (Security patch)
    ('e0000000-0000-0000-0000-000000000014',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000014',
     'Patch staging servers — CVE-2026-4521',
     'Apply OpenSSL patch to all staging servers and run regression tests.',
     'completed', 'critical',
     'b0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '1 day', 3.00, 2.00),

    ('e0000000-0000-0000-0000-000000000015',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000014',
     'Patch production servers — CVE-2026-4521',
     'Deploy validated OpenSSL patch to all production servers during maintenance window (2 AM - 5 AM).',
     'in_progress', 'critical',
     'b0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '2 days', 4.00, 1.00),

    -- Tasks for Request 13 (Sales report — completed)
    ('e0000000-0000-0000-0000-000000000016',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000013',
     'Pull Q3 regional sales data from CRM',
     'Export regional sales figures, pipeline data, and conversion rates from Salesforce for Q3 FY2026.',
     'completed', 'medium',
     'b0000000-0000-0000-0000-000000000006',
     'b0000000-0000-0000-0000-000000000002',
     'c0000000-0000-0000-0000-000000000004',
     NOW() - INTERVAL '10 days', 2.00, 2.00),

    ('e0000000-0000-0000-0000-000000000017',
     'a0000000-0000-0000-0000-000000000001',
     'd0000000-0000-0000-0000-000000000013',
     'Create Q3 sales presentation deck',
     'Build executive summary presentation with charts, YoY comparison, and regional breakdown.',
     'completed', 'medium',
     'b0000000-0000-0000-0000-000000000006',
     'b0000000-0000-0000-0000-000000000002',
     'c0000000-0000-0000-0000-000000000004',
     NOW() - INTERVAL '8 days', 4.00, 5.00),

    -- Standalone tasks (no request)
    ('e0000000-0000-0000-0000-000000000018',
     'a0000000-0000-0000-0000-000000000001',
     NULL,
     'Weekly IT infrastructure health check',
     'Run automated monitoring scripts, review alerts, check disk usage, and update the infrastructure dashboard.',
     'assigned', 'low',
     'b0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '3 days', 2.00, NULL),

    ('e0000000-0000-0000-0000-000000000019',
     'a0000000-0000-0000-0000-000000000001',
     NULL,
     'Update employee handbook — remote work policy',
     'Revise Section 5.2 of the employee handbook to reflect the new hybrid work policy approved by leadership.',
     'in_progress', 'medium',
     'b0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000001',
     'c0000000-0000-0000-0000-000000000001',
     NOW() + INTERVAL '10 days', 6.00, 2.00),

    ('e0000000-0000-0000-0000-000000000020',
     'a0000000-0000-0000-0000-000000000001',
     NULL,
     'Prepare monthly expense report — November',
     'Consolidate all department expense reports for November, flag anomalies, and submit for CFO review.',
     'new', 'medium',
     'b0000000-0000-0000-0000-000000000004',
     'b0000000-0000-0000-0000-000000000002',
     'c0000000-0000-0000-0000-000000000002',
     NOW() + INTERVAL '5 days', 4.00, NULL),

    ('e0000000-0000-0000-0000-000000000021',
     'a0000000-0000-0000-0000-000000000001',
     NULL,
     'Renew SSL certificates — *.acme-demo.com',
     'Renew wildcard SSL certificates before expiry on Dec 15. Update load balancer and CDN configurations.',
     'waiting_approval', 'high',
     'b0000000-0000-0000-0000-000000000005',
     'b0000000-0000-0000-0000-000000000005',
     'c0000000-0000-0000-0000-000000000003',
     NOW() + INTERVAL '20 days', 2.00, NULL),

    ('e0000000-0000-0000-0000-000000000022',
     'a0000000-0000-0000-0000-000000000001',
     NULL,
     'Client demo preparation — Enterprise Solutions pitch',
     'Prepare demo environment, presentation materials, and talking points for the Enterprise Solutions pitch to Globex Corp.',
     'in_progress', 'high',
     'b0000000-0000-0000-0000-000000000006',
     'b0000000-0000-0000-0000-000000000002',
     'c0000000-0000-0000-0000-000000000004',
     NOW() + INTERVAL '4 days', 8.00, 3.00);

-- ===================== TASK DEPENDENCIES =====================
INSERT INTO task_dependencies (task_id, depends_on_task_id, status) VALUES
    -- "Roll back firewall" depends on "Diagnose VPN"
    ('e0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'pending'),
    -- "Build review template" depends on "Draft OKR criteria"
    ('e0000000-0000-0000-0000-000000000009', 'e0000000-0000-0000-0000-000000000008', 'pending'),
    -- "Process corrective payments" depends on "Identify affected employees"
    ('e0000000-0000-0000-0000-000000000011', 'e0000000-0000-0000-0000-000000000010', 'met'),
    -- "SOC 2 evidence" depends on "Backup verification tests"
    ('e0000000-0000-0000-0000-000000000013', 'e0000000-0000-0000-0000-000000000012', 'pending'),
    -- "Patch production" depends on "Patch staging"
    ('e0000000-0000-0000-0000-000000000015', 'e0000000-0000-0000-0000-000000000014', 'met'),
    -- "Sales presentation" depended on "Pull CRM data"
    ('e0000000-0000-0000-0000-000000000017', 'e0000000-0000-0000-0000-000000000016', 'met');

-- ===================== COMMENTS =====================
INSERT INTO comments (entity_type, entity_id, user_id, content) VALUES
    ('request', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008',
     'Identified the issue — the new firewall rule is blocking UDP port 4500 (IPsec NAT-T). Working on a fix.'),
    ('request', 'd0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005',
     'Good catch, Raj. Please verify the fix in the staging environment before applying to production.'),
    ('request', 'd0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000004',
     'The Q1 campaign had a 3.2x ROI. I''m inclined to approve but need the detailed channel breakdown first.'),
    ('task', 'e0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000003',
     'Reviewed three OKR frameworks (Google, Intel, Atlassian). Recommending a hybrid approach. Draft ready for internal review.'),
    ('request', 'd0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000004',
     'Found 17 affected employees. Total discrepancy is $4,231.50. Correction batch is being prepared.'),
    ('request', 'd0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001',
     'Rejected — this exceeds the quarterly furniture budget. Please resubmit for Q2 with a phased rollout plan.'),
    ('task', 'e0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000008',
     'Staging patch verified — all regression tests pass. Scheduling production deployment for tonight''s maintenance window.'),
    ('task', 'e0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000006',
     'Demo environment is 80% ready. Need product team to confirm the new analytics dashboard feature is stable.'),
    ('request', 'd0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001',
     'CoolAir Solutions confirmed a technician visit tomorrow morning at 9 AM.'),
    ('task', 'e0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000003',
     'First draft of the updated remote work policy is ready. Sending to legal for compliance review.');

-- ===================== APPROVALS =====================
INSERT INTO approvals (org_id, entity_type, entity_id, requested_by, assigned_to, status, decision_note, decided_at) VALUES
    -- Budget approval — pending
    ('a0000000-0000-0000-0000-000000000001', 'request', 'd0000000-0000-0000-0000-000000000002',
     'b0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004',
     'pending', NULL, NULL),

    -- Onboarding — approved
    ('a0000000-0000-0000-0000-000000000001', 'request', 'd0000000-0000-0000-0000-000000000003',
     'b0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003',
     'approved', 'All onboarding tasks completed and verified.', NOW() - INTERVAL '3 days'),

    -- AC repair — approved
    ('a0000000-0000-0000-0000-000000000001', 'request', 'd0000000-0000-0000-0000-000000000005',
     'b0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001',
     'approved', 'Emergency repair approved. Vendor dispatched.', NOW() - INTERVAL '1 day'),

    -- Standing desks — rejected
    ('a0000000-0000-0000-0000-000000000001', 'request', 'd0000000-0000-0000-0000-000000000008',
     'b0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001',
     'rejected', 'Exceeds quarterly furniture budget. Resubmit for Q2 with phased rollout.', NOW() - INTERVAL '5 days'),

    -- SSL cert renewal — pending
    ('a0000000-0000-0000-0000-000000000001', 'task', 'e0000000-0000-0000-0000-000000000021',
     'b0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001',
     'pending', NULL, NULL);

-- ===================== NOTIFICATIONS =====================
INSERT INTO notifications (org_id, user_id, type, title, message, is_read, link) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008',
     'task_assigned', 'New Task Assigned',
     'You have been assigned: Diagnose VPN connection drops', false, '/tasks/e0000000-0000-0000-0000-000000000001'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
     'approval_request', 'Approval Required',
     'Carlos Rivera submitted a $45K budget request for Q2 marketing that needs your review.', false, '/requests/d0000000-0000-0000-0000-000000000002'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006',
     'request_rejected', 'Request Rejected',
     'Your request "Standing desks for the entire sales team" has been rejected. See decision notes.', true, '/requests/d0000000-0000-0000-0000-000000000008'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005',
     'comment_added', 'New Comment',
     'Raj Patel commented on the VPN access request.', false, '/requests/d0000000-0000-0000-0000-000000000001'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
     'approval_request', 'SSL Certificate Renewal Approval',
     'Lisa Tanaka is requesting approval for wildcard SSL certificate renewal for *.acme-demo.com.', false, '/tasks/e0000000-0000-0000-0000-000000000021'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
     'request_critical', 'Critical: Payroll Error',
     'A payroll processing error has been reported for the November cycle. Immediate attention required.', true, '/requests/d0000000-0000-0000-0000-000000000010'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003',
     'task_completed', 'Task Completed',
     'Onboarding tasks for Alex Kim have been completed successfully.', true, '/requests/d0000000-0000-0000-0000-000000000003'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008',
     'task_assigned', 'Security Patch Assignment',
     'You have been assigned to patch production servers for CVE-2026-4521.', false, '/tasks/e0000000-0000-0000-0000-000000000015');

-- ===================== WORKFLOW RULES (3) =====================
INSERT INTO workflow_rules (id, org_id, name, description, trigger_event, conditions, actions, is_active) VALUES
    ('f0000000-0000-0000-0000-000000000001',
     'a0000000-0000-0000-0000-000000000001',
     'Auto-assign critical requests to IT manager',
     'When a new request is classified as critical and categorized as IT, automatically assign it to the IT department manager.',
     'request.created',
     '[{"field":"priority","operator":"equals","value":"critical"},{"field":"ai_classification.suggested_dept","operator":"equals","value":"IT"}]'::jsonb,
     '[{"type":"assign_department","dept_id":"c0000000-0000-0000-0000-000000000003"},{"type":"assign_user","user_id":"b0000000-0000-0000-0000-000000000005"},{"type":"notify","user_id":"b0000000-0000-0000-0000-000000000005","message":"Critical IT request auto-assigned to you."}]'::jsonb,
     true),

    ('f0000000-0000-0000-0000-000000000002',
     'a0000000-0000-0000-0000-000000000001',
     'Escalate overdue tasks',
     'When a task passes its deadline without being completed, notify the department manager and change priority to high.',
     'task.deadline_passed',
     '[{"field":"status","operator":"not_in","value":["completed","rejected"]}]'::jsonb,
     '[{"type":"update_priority","value":"high"},{"type":"notify_manager","message":"A task in your department is overdue. Please review and take action."},{"type":"add_comment","content":"⚠️ This task is overdue. Automatically escalated to department manager."}]'::jsonb,
     true),

    ('f0000000-0000-0000-0000-000000000003',
     'a0000000-0000-0000-0000-000000000001',
     'AI classification on new requests',
     'Automatically run AI classification on every new request to suggest department, priority, and category.',
     'request.created',
     '[]'::jsonb,
     '[{"type":"ai_classify","model":"gpt-4","fields":["category","priority","suggested_dept","urgency","tags"]},{"type":"update_request","field":"ai_classification","source":"ai_result"},{"type":"audit_log","action":"ai_classification_completed"}]'::jsonb,
     true);

-- ===================== AUTOMATION LOGS =====================
INSERT INTO automation_logs (org_id, rule_id, trigger_data, actions_executed, status, error_message) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001',
     '{"request_id":"d0000000-0000-0000-0000-000000000001","priority":"critical","ai_classification":{"suggested_dept":"IT"}}'::jsonb,
     '{"assigned_dept":"c0000000-0000-0000-0000-000000000003","assigned_user":"b0000000-0000-0000-0000-000000000005","notification_sent":true}'::jsonb,
     'success', NULL),

    ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003',
     '{"request_id":"d0000000-0000-0000-0000-000000000002"}'::jsonb,
     '{"classification":{"category":"Budget","confidence":0.92,"suggested_dept":"Finance"},"request_updated":true,"audit_logged":true}'::jsonb,
     'success', NULL),

    ('a0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003',
     '{"request_id":"d0000000-0000-0000-0000-000000000014"}'::jsonb,
     '{"classification":{"category":"Security","confidence":0.99,"suggested_dept":"IT"},"request_updated":true,"audit_logged":true}'::jsonb,
     'success', NULL);

-- ===================== AI ANALYSIS RECORDS =====================
INSERT INTO ai_analysis_records (org_id, entity_type, entity_id, analysis_type, result, model_used, tokens_used) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'request', 'd0000000-0000-0000-0000-000000000001',
     'classification',
     '{"category":"IT Support","confidence":0.97,"suggested_dept":"IT","urgency":"critical","tags":["vpn","networking","remote-work"],"reasoning":"Multiple users affected by connectivity issues following infrastructure change."}'::jsonb,
     'gpt-4', 320),

    ('a0000000-0000-0000-0000-000000000001', 'request', 'd0000000-0000-0000-0000-000000000014',
     'classification',
     '{"category":"Security","confidence":0.99,"suggested_dept":"IT","urgency":"critical","tags":["security","patch","CVE","urgent"],"reasoning":"Known CVE with active exploits. Immediate patching required."}'::jsonb,
     'gpt-4', 285);

-- ===================== AUDIT LOGS =====================
INSERT INTO audit_logs (org_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
     'create', 'organization', 'a0000000-0000-0000-0000-000000000001',
     NULL, '{"name":"Acme Corporation","slug":"acme-demo"}'::jsonb, '192.168.1.100'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005',
     'create', 'request', 'd0000000-0000-0000-0000-000000000014',
     NULL, '{"title":"Security patch deployment — CVE-2026-4521","priority":"critical"}'::jsonb, '10.0.0.45'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001',
     'update_status', 'request', 'd0000000-0000-0000-0000-000000000008',
     '{"status":"new"}'::jsonb, '{"status":"rejected"}'::jsonb, '192.168.1.100'),

    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004',
     'update_status', 'task', 'e0000000-0000-0000-0000-000000000010',
     '{"status":"in_progress"}'::jsonb, '{"status":"completed"}'::jsonb, '10.0.0.32');

-- ===================== CONVERSATION HISTORY =====================
INSERT INTO conversation_history (org_id, user_id, role, content, context) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007',
     'user', 'The VPN keeps disconnecting every 10-15 minutes for our remote team',
     '{"session_id":"chat-001","page":"/requests/new"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007',
     'assistant', 'I''ve created a critical IT support request for the VPN connectivity issues. It has been auto-assigned to Lisa Tanaka (IT Manager) based on the classification. You can track it at Request #d0000000-0000-0000-0000-000000000001.',
     '{"session_id":"chat-001","request_created":"d0000000-0000-0000-0000-000000000001"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006',
     'user', 'How do I submit a budget request for next quarter''s marketing campaign?',
     '{"session_id":"chat-002","page":"/dashboard"}'::jsonb),
    ('a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006',
     'assistant', 'You can submit a budget request by going to Requests → New Request and selecting "Budget" as the category. Include the total amount, a breakdown by channel, and expected ROI. The request will be routed to the Finance department for review.',
     '{"session_id":"chat-002"}'::jsonb);

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
