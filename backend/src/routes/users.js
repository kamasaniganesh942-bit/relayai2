const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { createUserSchema, updateUserSchema } = require('../validators/organizations');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/users — List users in org
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  let query = supabase
    .from('users')
    .select('id, org_id, email, first_name, last_name, role, avatar_url, is_active, created_at', { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (req.query.role) query = query.eq('role', req.query.role);
  if (req.query.isActive !== undefined) query = query.eq('is_active', req.query.isActive === 'true');
  if (req.query.search) {
    query = query.or(`first_name.ilike.%${req.query.search}%,last_name.ilike.%${req.query.search}%,email.ilike.%${req.query.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return errorResponse(res, 'Failed to fetch users.', 500);
  }

  return successResponse(res, data, 200, buildPagination(page, limit, count || 0));
});

// POST /api/users — Create user (admin only)
router.post('/', authenticate, authorize('super_admin', 'org_admin'), validate(createUserSchema), async (req, res) => {
  const { email, password, firstName, lastName, role, departmentId } = req.body;
  const orgId = req.user.org_id;

  const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
  if (existing) {
    return errorResponse(res, 'A user with this email already exists.', 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = uuidv4();

  const { data, error } = await supabase.from('users').insert({
    id: userId,
    org_id: orgId,
    email,
    password_hash: passwordHash,
    first_name: firstName,
    last_name: lastName,
    role,
    is_active: true,
  }).select('id, email, first_name, last_name, role, is_active, created_at').single();

  if (error) {
    return errorResponse(res, 'Failed to create user.', 500);
  }

  // Add to department if specified
  if (departmentId) {
    await supabase.from('department_members').insert({
      id: uuidv4(),
      dept_id: departmentId,
      user_id: userId,
      role: 'member',
    });
  }

  return successResponse(res, data, 201);
});

// GET /api/users/:id — Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, org_id, email, first_name, last_name, role, avatar_url, is_active, created_at')
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .single();

  if (error || !user) {
    return errorResponse(res, 'User not found.', 404);
  }

  // Get departments
  const { data: memberships } = await supabase
    .from('department_members')
    .select('dept_id, role, departments(id, name)')
    .eq('user_id', user.id);

  return successResponse(res, { ...user, departments: memberships || [] });
});

// PUT /api/users/:id — Update user
router.put('/:id', authenticate, authorize('super_admin', 'org_admin'), validate(updateUserSchema), async (req, res) => {
  const updates = {};
  if (req.body.firstName !== undefined) updates.first_name = req.body.firstName;
  if (req.body.lastName !== undefined) updates.last_name = req.body.lastName;
  if (req.body.role !== undefined) updates.role = req.body.role;
  if (req.body.isActive !== undefined) updates.is_active = req.body.isActive;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .select('id, email, first_name, last_name, role, is_active')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update user.', 500);
  }

  return successResponse(res, data);
});

// DELETE /api/users/:id — Deactivate user
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin'), async (req, res) => {
  if (req.params.id === req.user.id) {
    return errorResponse(res, 'You cannot deactivate your own account.', 400);
  }

  const { error } = await supabase
    .from('users')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id);

  if (error) {
    return errorResponse(res, 'Failed to deactivate user.', 500);
  }

  return successResponse(res, { message: 'User deactivated successfully.' });
});

// GET /api/users/department/:deptId — List users by department
router.get('/department/:deptId', authenticate, async (req, res) => {
  const { data: members, error } = await supabase
    .from('department_members')
    .select('user_id, role, users(id, email, first_name, last_name, role, avatar_url, is_active)')
    .eq('dept_id', req.params.deptId);

  if (error) {
    return errorResponse(res, 'Failed to fetch department members.', 500);
  }

  const users = (members || []).map((m) => ({ ...m.users, departmentRole: m.role }));
  return successResponse(res, users);
});

module.exports = router;
