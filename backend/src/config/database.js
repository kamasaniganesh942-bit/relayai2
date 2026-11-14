const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (supabaseUrl && supabaseServiceKey && supabaseUrl !== 'your_supabase_url_here') {
  console.log('[RELAY AI Database] Initializing Supabase PostgreSQL client at', supabaseUrl);
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
} else {
  console.log('[RELAY AI Database] No Supabase credentials provided or in demo mode. Initializing In-Memory Mock Database pre-loaded with Acme Corp dataset.');
  
  // Pre-seed demo datasets
  const DEMO_ORG_ID = 'a0000000-0000-0000-0000-000000000001';
  const defaultHash = bcrypt.hashSync('Demo123!', 10);

  const tables = {
    organizations: [
      {
        id: DEMO_ORG_ID,
        name: 'Acme Corporation',
        slug: 'acme-demo',
        industry: 'Technology & Manufacturing',
        size_range: '250-500',
        settings: {
          priority_weights: { time_sensitivity: 0.35, business_impact: 0.35, customer_impact: 0.20, urgency: 0.10 },
          auto_assignment: true,
          ai_model: 'gemini-1.5-flash',
          notification_channels: ['in_app', 'email'],
          sla_hours: { critical: 4, high: 12, medium: 48, low: 96 }
        },
        is_active: true,
        created_at: new Date('2026-01-01T00:00:00Z').toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    users: [
      {
        id: 'b0000000-0000-0000-0000-000000000001',
        org_id: DEMO_ORG_ID,
        email: 'admin@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'Sarah',
        last_name: 'Chen',
        role: 'super_admin',
        title: 'VP of Operations',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000002',
        org_id: DEMO_ORG_ID,
        email: 'james.wilson@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'James',
        last_name: 'Wilson',
        role: 'org_admin',
        title: 'Director of Technology',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000003',
        org_id: DEMO_ORG_ID,
        email: 'priya.sharma@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'Priya',
        last_name: 'Sharma',
        role: 'dept_manager',
        title: 'HR Manager',
        avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000004',
        org_id: DEMO_ORG_ID,
        email: 'michael.okonkwo@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'Michael',
        last_name: 'Okonkwo',
        role: 'dept_manager',
        title: 'Finance Controller',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000005',
        org_id: DEMO_ORG_ID,
        email: 'lisa.tanaka@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'Lisa',
        last_name: 'Tanaka',
        role: 'dept_manager',
        title: 'IT Infrastructure Lead',
        avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000006',
        org_id: DEMO_ORG_ID,
        email: 'david.park@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'David',
        last_name: 'Park',
        role: 'employee',
        title: 'Senior Software Engineer',
        avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000007',
        org_id: DEMO_ORG_ID,
        email: 'elena.rostova@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'Elena',
        last_name: 'Rostova',
        role: 'employee',
        title: 'Sales Operations Specialist',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'b0000000-0000-0000-0000-000000000008',
        org_id: DEMO_ORG_ID,
        email: 'marcus.brody@acme-demo.com',
        password_hash: defaultHash,
        first_name: 'Marcus',
        last_name: 'Brody',
        role: 'employee',
        title: 'Logistics Coordinator',
        avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    departments: [
      {
        id: 'c0000000-0000-0000-0000-000000000001',
        org_id: DEMO_ORG_ID,
        name: 'Human Resources',
        code: 'HR',
        description: 'Talent acquisition, employee relations, benefits, and workplace culture.',
        manager_id: 'b0000000-0000-0000-0000-000000000003',
        color: '#ec4899',
        created_at: new Date().toISOString()
      },
      {
        id: 'c0000000-0000-0000-0000-000000000002',
        org_id: DEMO_ORG_ID,
        name: 'Finance & Accounting',
        code: 'FIN',
        description: 'Budgeting, payroll, procurement approvals, and financial reporting.',
        manager_id: 'b0000000-0000-0000-0000-000000000004',
        color: '#10b981',
        created_at: new Date().toISOString()
      },
      {
        id: 'c0000000-0000-0000-0000-000000000003',
        org_id: DEMO_ORG_ID,
        name: 'Information Technology',
        code: 'IT',
        description: 'Systems infrastructure, help desk, hardware, and cybersecurity.',
        manager_id: 'b0000000-0000-0000-0000-000000000005',
        color: '#3b82f6',
        created_at: new Date().toISOString()
      },
      {
        id: 'c0000000-0000-0000-0000-000000000004',
        org_id: DEMO_ORG_ID,
        name: 'Sales & Marketing',
        code: 'SALES',
        description: 'Enterprise account management, inbound leads, and campaign collateral.',
        manager_id: 'b0000000-0000-0000-0000-000000000002',
        color: '#f59e0b',
        created_at: new Date().toISOString()
      },
      {
        id: 'c0000000-0000-0000-0000-000000000005',
        org_id: DEMO_ORG_ID,
        name: 'Operations & Logistics',
        code: 'OPS',
        description: 'Supply chain, vendor management, office facilities, and fulfillment.',
        manager_id: 'b0000000-0000-0000-0000-000000000001',
        color: '#8b5cf6',
        created_at: new Date().toISOString()
      }
    ],
    department_members: [
      { id: 'dm-1', dept_id: 'c0000000-0000-0000-0000-000000000001', user_id: 'b0000000-0000-0000-0000-000000000003', role: 'manager' },
      { id: 'dm-2', dept_id: 'c0000000-0000-0000-0000-000000000002', user_id: 'b0000000-0000-0000-0000-000000000004', role: 'manager' },
      { id: 'dm-3', dept_id: 'c0000000-0000-0000-0000-000000000003', user_id: 'b0000000-0000-0000-0000-000000000005', role: 'manager' },
      { id: 'dm-4', dept_id: 'c0000000-0000-0000-0000-000000000003', user_id: 'b0000000-0000-0000-0000-000000000006', role: 'member' },
      { id: 'dm-5', dept_id: 'c0000000-0000-0000-0000-000000000004', user_id: 'b0000000-0000-0000-0000-000000000007', role: 'member' },
      { id: 'dm-6', dept_id: 'c0000000-0000-0000-0000-000000000005', user_id: 'b0000000-0000-0000-0000-000000000008', role: 'member' }
    ],
    requests: [
      {
        id: 'd0000000-0000-0000-0000-000000000001',
        org_id: DEMO_ORG_ID,
        title: 'Urgent Laptop Replacement for Client Presentation',
        description: 'My workstation suddenly experienced kernel panic and hardware failure. I have an executive client presentation tomorrow at 2 PM and urgently need a loaner MacBook or diagnostic repair.',
        submitted_by: 'b0000000-0000-0000-0000-000000000006',
        status: 'in_progress',
        priority: 'critical',
        category: 'IT Support',
        request_type: 'Hardware Failure',
        assigned_dept: 'c0000000-0000-0000-0000-000000000003',
        assigned_to: 'b0000000-0000-0000-0000-000000000005',
        deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        ai_classification: {
          category: 'IT Support',
          requestType: 'Hardware Failure',
          priority: 'critical',
          urgency: 'immediate',
          suggestedDepartment: 'Information Technology',
          suggestedAction: 'Provision backup loaner laptop & recover presentation slides',
          confidence: 0.98,
          explanation: 'Hardware crash directly threatens an executive client presentation within 24 hours.'
        },
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'd0000000-0000-0000-0000-000000000002',
        org_id: DEMO_ORG_ID,
        title: 'Q3 Enterprise CRM Subscription Renewal & Seat Upgrade',
        description: 'Our Salesforce contract renewal is due next week. We need to add 15 additional sales rep seats for the newly onboarded team in European region.',
        submitted_by: 'b0000000-0000-0000-0000-000000000007',
        status: 'waiting_approval',
        priority: 'high',
        category: 'Finance & Procurement',
        request_type: 'Software License',
        assigned_dept: 'c0000000-0000-0000-0000-000000000002',
        assigned_to: 'b0000000-0000-0000-0000-000000000004',
        deadline: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
        ai_classification: {
          category: 'Finance & Procurement',
          requestType: 'License Renewal',
          priority: 'high',
          urgency: 'this_week',
          suggestedDepartment: 'Finance & Accounting',
          suggestedAction: 'Review budget line items and trigger approval workflow for $18,500 PO',
          confidence: 0.95,
          explanation: 'Contract expiration within 5 days impacting 15 newly hired sales personnel.'
        },
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'd0000000-0000-0000-0000-000000000003',
        org_id: DEMO_ORG_ID,
        title: 'New Senior Frontend Engineer Onboarding Kit',
        description: 'New hire Alex Rivera joins next Monday. Need accounts provisioned for GitHub, AWS, Slack, and dispatch of ergonomic desk peripherals.',
        submitted_by: 'b0000000-0000-0000-0000-000000000003',
        status: 'assigned',
        priority: 'medium',
        category: 'HR & Onboarding',
        request_type: 'Personnel Setup',
        assigned_dept: 'c0000000-0000-0000-0000-000000000001',
        assigned_to: 'b0000000-0000-0000-0000-000000000003',
        deadline: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
        ai_classification: {
          category: 'HR & Onboarding',
          requestType: 'Employee Onboarding',
          priority: 'medium',
          urgency: 'scheduled',
          suggestedDepartment: 'Human Resources',
          suggestedAction: 'Coordinate IT provisioning and facility logistics checklist',
          confidence: 0.92,
          explanation: 'Standard onboarding protocol with 4-day runway.'
        },
        created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    tasks: [
      {
        id: 'e0000000-0000-0000-0000-000000000001',
        org_id: DEMO_ORG_ID,
        request_id: 'd0000000-0000-0000-0000-000000000001',
        title: 'Configure Loaner MacBook Pro & Sync Google Drive',
        description: 'Prep serial #MBP-2024-889 with developer profile, credentials, and sync presentation deck.',
        status: 'in_progress',
        priority: 'critical',
        dept_id: 'c0000000-0000-0000-0000-000000000003',
        assigned_to: 'b0000000-0000-0000-0000-000000000005',
        assigned_by: 'b0000000-0000-0000-0000-000000000001',
        deadline: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
        estimated_hours: 2.5,
        actual_hours: 1.0,
        is_blocked: false,
        created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'e0000000-0000-0000-0000-000000000002',
        org_id: DEMO_ORG_ID,
        request_id: 'd0000000-0000-0000-0000-000000000002',
        title: 'Audit Salesforce License Usage and Validate Seat Count',
        description: 'Verify inactive licenses before purchasing 15 new add-ons to optimize spending.',
        status: 'waiting_approval',
        priority: 'high',
        dept_id: 'c0000000-0000-0000-0000-000000000002',
        assigned_to: 'b0000000-0000-0000-0000-000000000004',
        assigned_by: 'b0000000-0000-0000-0000-000000000002',
        deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        estimated_hours: 4.0,
        actual_hours: 2.0,
        is_blocked: true,
        block_reason: 'Waiting for Finance VP budget approval sign-off',
        created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'e0000000-0000-0000-0000-000000000003',
        org_id: DEMO_ORG_ID,
        request_id: null,
        title: 'Quarterly SOC2 Compliance Security Access Review',
        description: 'Audit all active developer access keys, revoke stale API tokens, and enforce MFA.',
        status: 'under_review',
        priority: 'high',
        dept_id: 'c0000000-0000-0000-0000-000000000003',
        assigned_to: 'b0000000-0000-0000-0000-000000000006',
        assigned_by: 'b0000000-0000-0000-0000-000000000005',
        deadline: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
        estimated_hours: 8.0,
        actual_hours: 5.5,
        is_blocked: false,
        created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'e0000000-0000-0000-0000-000000000004',
        org_id: DEMO_ORG_ID,
        request_id: null,
        title: 'Implement AI Automated Request Routing Rules',
        description: 'Verify the confidence thresholds for automatic assignment to IT and Finance departments.',
        status: 'completed',
        priority: 'medium',
        dept_id: 'c0000000-0000-0000-0000-000000000005',
        assigned_to: 'b0000000-0000-0000-0000-000000000008',
        assigned_by: 'b0000000-0000-0000-0000-000000000001',
        deadline: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        estimated_hours: 6.0,
        actual_hours: 5.0,
        is_blocked: false,
        completed_at: new Date().toISOString(),
        created_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    task_dependencies: [
      {
        id: 'dep-1',
        task_id: 'e0000000-0000-0000-0000-000000000002',
        depends_on_task_id: 'e0000000-0000-0000-0000-000000000001',
        dependency_type: 'finish_to_start',
        is_resolved: false
      }
    ],
    approvals: [
      {
        id: 'app-1',
        org_id: DEMO_ORG_ID,
        entity_type: 'request',
        entity_id: 'd0000000-0000-0000-0000-000000000002',
        title: 'Salesforce Enterprise Renewal PO #88391',
        requested_by: 'b0000000-0000-0000-0000-000000000007',
        approver_id: 'b0000000-0000-0000-0000-000000000004',
        approver_dept_id: 'c0000000-0000-0000-0000-000000000002',
        status: 'pending',
        amount: 18500.00,
        created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    comments: [
      {
        id: 'comm-1',
        org_id: DEMO_ORG_ID,
        entity_type: 'request',
        entity_id: 'd0000000-0000-0000-0000-000000000001',
        user_id: 'b0000000-0000-0000-0000-000000000005',
        content: 'I have pulled a reserve M2 MacBook Pro from inventory and am setting up the company profile now. Will have it ready for pickup by 11:30 AM.',
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      }
    ],
    notifications: [
      {
        id: 'notif-1',
        org_id: DEMO_ORG_ID,
        user_id: 'b0000000-0000-0000-0000-000000000001',
        type: 'critical_alert',
        title: 'Critical Hardware Request Submitted',
        message: 'David Park reported a sudden workstation failure prior to tomorrow client pitch.',
        link: '/requests/d0000000-0000-0000-0000-000000000001',
        is_read: false,
        severity: 'critical',
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: 'notif-2',
        org_id: DEMO_ORG_ID,
        user_id: 'b0000000-0000-0000-0000-000000000004',
        type: 'approval_needed',
        title: 'Pending Budget Approval: Salesforce Q3',
        message: 'Elena Rostova requested approval for PO #88391 ($18,500.00).',
        link: '/approvals',
        is_read: false,
        severity: 'warning',
        created_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
      }
    ],
    workflow_rules: [
      {
        id: 'wf-1',
        org_id: DEMO_ORG_ID,
        name: 'Auto-Route Critical IT Incidents',
        description: 'When request priority is critical and category is IT, immediately notify IT Lead and assign to IT department.',
        trigger_event: 'request_created',
        conditions: [{ field: 'priority', operator: 'equals', value: 'critical' }, { field: 'category', operator: 'equals', value: 'IT Support' }],
        actions: [{ action: 'notify_department_manager' }, { action: 'set_sla_hours', value: 4 }],
        is_active: true,
        execution_count: 14,
        created_at: new Date().toISOString()
      },
      {
        id: 'wf-2',
        org_id: DEMO_ORG_ID,
        name: 'High-Value Finance Approval Gate',
        description: 'Trigger multi-stage approval when request procurement amount exceeds $10,000.',
        trigger_event: 'request_created',
        conditions: [{ field: 'category', operator: 'equals', value: 'Finance & Procurement' }],
        actions: [{ action: 'create_approval_request', approver: 'michael.okonkwo@acme-demo.com' }],
        is_active: true,
        execution_count: 8,
        created_at: new Date().toISOString()
      }
    ],
    automation_logs: [
      {
        id: 'autolog-1',
        org_id: DEMO_ORG_ID,
        rule_name: 'Auto-Route Critical IT Incidents',
        trigger_event: 'request_created',
        trigger_entity_id: 'd0000000-0000-0000-0000-000000000001',
        actions_executed: [{ action: 'notify_department_manager', status: 'success' }, { action: 'set_sla_hours', value: 4, status: 'success' }],
        status: 'success',
        execution_duration_ms: 142,
        executed_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      }
    ],
    ai_analysis_records: [
      {
        id: 'ai-rec-1',
        org_id: DEMO_ORG_ID,
        entity_type: 'request',
        entity_id: 'd0000000-0000-0000-0000-000000000001',
        analysis_type: 'classification',
        input_text: 'Urgent Laptop Replacement for Client Presentation',
        result: { category: 'IT Support', priority: 'critical', confidence: 0.98 },
        model_used: 'gemini-1.5-flash',
        prompt_tokens: 340,
        completion_tokens: 120,
        confidence_score: 0.98,
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      }
    ],
    reports: [
      {
        id: 'rep-1',
        org_id: DEMO_ORG_ID,
        generated_by: 'b0000000-0000-0000-0000-000000000001',
        report_type: 'weekly_performance',
        title: 'Acme Corp Operational Velocity & Bottleneck Audit (Week 45)',
        content: {
          executiveSummary: 'Organizational request velocity rose 18% week-over-week. IT Support solved 94% of incident tickets within 4-hour SLA. Primary operational delay identified in Finance procurement approval queue.',
          keyMetrics: { totalRequests: 42, resolvedTasks: 38, avgResolutionHours: 14.2, slaComplianceRate: '92.8%' },
          bottlenecks: ['Cross-department dependency between IT procurement and Finance PO sign-off averaging 32-hour delay.'],
          recommendations: ['Enable automatic approval thresholds for hardware under $2,000 to eliminate 70% of IT gate delays.']
        },
        created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ],
    conversation_history: []
  };

  // Mock Supabase Query Builder
  class MockQueryBuilder {
    constructor(tableName) {
      this.tableName = tableName;
      this.filters = [];
      this.sortCol = null;
      this.sortAsc = true;
      this.offsetVal = 0;
      this.limitVal = null;
      this.isSingle = false;
      this.selectFields = '*';
      this.countMode = null;
    }

    select(fields = '*', options = {}) {
      this.selectFields = fields;
      if (options.count) this.countMode = options.count;
      return this;
    }

    eq(column, value) {
      this.filters.push(item => item[column] === value);
      return this;
    }

    neq(column, value) {
      this.filters.push(item => item[column] !== value);
      return this;
    }

    in(column, values) {
      const arr = Array.isArray(values) ? values : (typeof values === 'string' ? values.replace(/[()"]/g, '').split(',') : [values]);
      this.filters.push(item => arr.includes(item[column]));
      return this;
    }

    not(column, operator, value) {
      if (operator === 'eq') {
        this.filters.push(item => item[column] !== value);
      } else if (operator === 'in') {
        const arr = Array.isArray(value) ? value : (typeof value === 'string' ? value.replace(/[()"]/g, '').split(',') : [value]);
        this.filters.push(item => !arr.includes(item[column]));
      } else {
        this.filters.push(item => item[column] !== value);
      }
      return this;
    }

    lt(column, value) {
      this.filters.push(item => item[column] !== null && item[column] !== undefined && item[column] < value);
      return this;
    }

    gt(column, value) {
      this.filters.push(item => item[column] !== null && item[column] !== undefined && item[column] > value);
      return this;
    }

    lte(column, value) {
      this.filters.push(item => item[column] !== null && item[column] !== undefined && item[column] <= value);
      return this;
    }

    gte(column, value) {
      this.filters.push(item => item[column] !== null && item[column] !== undefined && item[column] >= value);
      return this;
    }

    ilike(column, pattern) {
      const clean = pattern.replace(/%/g, '').toLowerCase();
      this.filters.push(item => String(item[column] || '').toLowerCase().includes(clean));
      return this;
    }

    like(column, pattern) {
      const clean = pattern.replace(/%/g, '');
      this.filters.push(item => String(item[column] || '').includes(clean));
      return this;
    }

    order(column, options = {}) {
      this.sortCol = column;
      this.sortAsc = options.ascending !== false;
      return this;
    }

    range(from, to) {
      this.offsetVal = from;
      this.limitVal = to - from + 1;
      return this;
    }

    limit(num) {
      this.limitVal = num;
      return this;
    }

    single() {
      this.isSingle = true;
      return this;
    }

    async then(resolve, reject) {
      try {
        const table = tables[this.tableName] || [];
        let result = table.filter(item => this.filters.every(fn => fn(item)));
        const totalCount = result.length;

        if (this.sortCol) {
          result.sort((a, b) => {
            const valA = a[this.sortCol];
            const valB = b[this.sortCol];
            if (valA < valB) return this.sortAsc ? -1 : 1;
            if (valA > valB) return this.sortAsc ? 1 : -1;
            return 0;
          });
        }

        if (this.offsetVal > 0) {
          result = result.slice(this.offsetVal);
        }
        if (this.limitVal !== null) {
          result = result.slice(0, this.limitVal);
        }

        // Hydrate related relations if requested in join syntax
        result = result.map(item => {
          const cloned = { ...item };
          if (this.selectFields.includes('assignee:users') || this.selectFields.includes('users!tasks_assigned_to_fkey')) {
            const user = tables.users.find(u => u.id === item.assigned_to);
            cloned.assignee = user ? { id: user.id, first_name: user.first_name, last_name: user.last_name, avatar_url: user.avatar_url } : null;
          }
          if (this.selectFields.includes('department:departments') || this.selectFields.includes('departments!tasks_dept_id_fkey')) {
            const dept = tables.departments.find(d => d.id === (item.dept_id || item.assigned_dept));
            cloned.department = dept ? { id: dept.id, name: dept.name, code: dept.code } : null;
          }
          if (this.selectFields.includes('users!departments_manager_id_fkey')) {
            const manager = tables.users.find(u => u.id === item.manager_id);
            cloned.manager = manager ? { id: manager.id, first_name: manager.first_name, last_name: manager.last_name, email: manager.email } : null;
            cloned.users = cloned.manager;
          }
          return cloned;
        });

        if (this.isSingle) {
          return resolve({ data: result[0] || null, error: result.length === 0 ? { message: 'Row not found' } : null });
        }

        return resolve({
          data: result,
          count: this.countMode ? totalCount : result.length,
          error: null
        });
      } catch (err) {
        return resolve({ data: null, error: err });
      }
    }

    async insert(records) {
      if (!tables[this.tableName]) tables[this.tableName] = [];
      const items = Array.isArray(records) ? records : [records];
      const inserted = items.map(item => {
        const newItem = {
          id: item.id || `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: item.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item
        };
        tables[this.tableName].unshift(newItem);
        return newItem;
      });

      return {
        data: Array.isArray(records) ? inserted : inserted[0],
        error: null,
        select: () => ({
          single: async () => ({ data: inserted[0], error: null })
        })
      };
    }

    async update(updates) {
      if (!tables[this.tableName]) return { data: null, error: null };
      const updated = [];
      tables[this.tableName] = tables[this.tableName].map(item => {
        if (this.filters.every(fn => fn(item))) {
          const mod = { ...item, ...updates, updated_at: new Date().toISOString() };
          updated.push(mod);
          return mod;
        }
        return item;
      });

      return {
        data: this.isSingle ? (updated[0] || null) : updated,
        error: null,
        select: () => ({
          single: async () => ({ data: updated[0] || null, error: null })
        })
      };
    }

    async delete() {
      if (!tables[this.tableName]) return { data: null, error: null };
      const deleted = [];
      tables[this.tableName] = tables[this.tableName].filter(item => {
        const matches = this.filters.every(fn => fn(item));
        if (matches) deleted.push(item);
        return !matches;
      });
      return { data: deleted, error: null };
    }
  }

  supabase = {
    from: (tableName) => new MockQueryBuilder(tableName)
  };
}

module.exports = { supabase };
