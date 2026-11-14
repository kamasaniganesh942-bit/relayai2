const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require('../validators/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

const router = express.Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res) => {
  const { email, password, firstName, lastName, organizationName } = req.body;

  // Check if user exists
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return errorResponse(res, 'An account with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const orgId = uuidv4();
  const userId = uuidv4();
  const slug = organizationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  // Create organization
  const { error: orgError } = await supabase.from('organizations').insert({
    id: orgId,
    name: organizationName,
    slug: `${slug}-${orgId.substring(0, 8)}`,
    settings: {},
  });

  if (orgError) {
    return errorResponse(res, 'Failed to create organization.', 500);
  }

  // Create user as org_admin
  const { error: userError } = await supabase.from('users').insert({
    id: userId,
    org_id: orgId,
    email,
    password_hash: passwordHash,
    first_name: firstName,
    last_name: lastName,
    role: 'org_admin',
    is_active: true,
  });

  if (userError) {
    // Rollback org
    await supabase.from('organizations').delete().eq('id', orgId);
    return errorResponse(res, 'Failed to create user account.', 500);
  }

  const token = jwt.sign({ userId, orgId, role: 'org_admin' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  return successResponse(res, {
    token,
    user: { id: userId, email, firstName, lastName, role: 'org_admin', orgId },
  }, 201);
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, org_id, email, password_hash, first_name, last_name, role, avatar_url, is_active')
    .eq('email', email)
    .single();

  if (error || !user) {
    return errorResponse(res, 'Invalid email or password.', 401);
  }

  if (!user.is_active) {
    return errorResponse(res, 'Account is deactivated. Contact your administrator.', 403);
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return errorResponse(res, 'Invalid email or password.', 401);
  }

  const token = jwt.sign(
    { userId: user.id, orgId: user.org_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const permissionsByRole = {
    super_admin: ['Organization Wide Access', 'Full Financial & PO Approvals', 'Department Architecture', 'AI Policy Management', 'User Provisioning'],
    org_admin: ['Department Orchestration', 'Employee Provisioning', 'Workflow Automation Rules', 'Cross-Dept Analytics', 'Budget Approvals up to $50,000'],
    dept_manager: ['Department Task Dispatch', 'Team Member Workload Management', 'Requisition Approvals up to $15,000', 'Department Health Analytics'],
    employee: ['Submit Business Requests', 'Task Execution & Commenting', 'Dependency Visibility', 'In-App Alerts'],
  };

  return successResponse(res, {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      title: user.title || 'Enterprise Member',
      phone: user.phone || '+1 (555) 234-5678',
      avatarUrl: user.avatar_url,
      avatar_url: user.avatar_url,
      orgId: user.org_id,
      org_id: user.org_id,
      organizationName: 'Acme Corporation',
      departmentName: user.role === 'dept_manager' ? 'Department Leadership' : 'Cross-Functional Team',
      permissions: permissionsByRole[user.role] || permissionsByRole.employee,
      created_at: user.created_at,
    },
  });
});

// GET /api/auth/me and GET /api/auth/profile
const getMeHandler = async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, org_id, email, first_name, last_name, role, title, phone, avatar_url, is_active, created_at')
    .eq('id', req.user.id)
    .single();

  if (error || !user) {
    return errorResponse(res, 'User not found.', 404);
  }

  // Get org info
  const { data: org } = await supabase
    .from('organizations')
    .select('id, name, slug')
    .eq('id', user.org_id)
    .single();

  const permissionsByRole = {
    super_admin: ['Organization Wide Access', 'Full Financial & PO Approvals', 'Department Architecture', 'AI Policy Management', 'User Provisioning'],
    org_admin: ['Department Orchestration', 'Employee Provisioning', 'Workflow Automation Rules', 'Cross-Dept Analytics', 'Budget Approvals up to $50,000'],
    dept_manager: ['Department Task Dispatch', 'Team Member Workload Management', 'Requisition Approvals up to $15,000', 'Department Health Analytics'],
    employee: ['Submit Business Requests', 'Task Execution & Commenting', 'Dependency Visibility', 'In-App Alerts'],
  };

  return successResponse(res, {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
    title: user.title || 'Enterprise Member',
    phone: user.phone || '+1 (555) 234-5678',
    avatarUrl: user.avatar_url,
    avatar_url: user.avatar_url,
    isActive: user.is_active,
    createdAt: user.created_at,
    created_at: user.created_at,
    organization: org || { name: 'Acme Corporation', slug: 'acme-demo' },
    organizationName: org?.name || 'Acme Corporation',
    permissions: permissionsByRole[user.role] || permissionsByRole.employee,
  });
};

router.get('/me', authenticate, getMeHandler);
router.get('/profile', authenticate, getMeHandler);

// PUT /api/auth/profile
router.put('/profile', authenticate, validate(updateProfileSchema), async (req, res) => {
  const updates = {};
  if (req.body.firstName !== undefined) updates.first_name = req.body.firstName;
  if (req.body.lastName !== undefined) updates.last_name = req.body.lastName;
  if (req.body.avatarUrl !== undefined) updates.avatar_url = req.body.avatarUrl;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.user.id)
    .select('id, email, first_name, last_name, role, avatar_url')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update profile.', 500);
  }

  return successResponse(res, {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    avatarUrl: data.avatar_url,
  });
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, validate(changePasswordSchema), async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const { data: user } = await supabase
    .from('users')
    .select('password_hash')
    .eq('id', req.user.id)
    .single();

  if (!user) {
    return errorResponse(res, 'User not found.', 404);
  }

  const valid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!valid) {
    return errorResponse(res, 'Current password is incorrect.', 400);
  }

  const newHash = await bcrypt.hash(newPassword, 10);

  const { error } = await supabase
    .from('users')
    .update({ password_hash: newHash, updated_at: new Date().toISOString() })
    .eq('id', req.user.id);

  if (error) {
    return errorResponse(res, 'Failed to change password.', 500);
  }

  return successResponse(res, { message: 'Password changed successfully.' });
});

module.exports = router;
