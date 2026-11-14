const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { createDepartmentSchema, updateDepartmentSchema, addMemberSchema } = require('../validators/departments');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/departments — List departments
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  const { data, error, count } = await supabase
    .from('departments')
    .select('*, users!departments_manager_id_fkey(id, first_name, last_name, email)', { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return errorResponse(res, 'Failed to fetch departments.', 500);
  }

  return successResponse(res, data, 200, buildPagination(page, limit, count || 0));
});

// POST /api/departments — Create department
router.post('/', authenticate, authorize('super_admin', 'org_admin'), validate(createDepartmentSchema), async (req, res) => {
  const { name, description, managerId } = req.body;
  const orgId = req.user.org_id;

  const { data, error } = await supabase.from('departments').insert({
    id: uuidv4(),
    org_id: orgId,
    name,
    description,
    manager_id: managerId || null,
  }).select('*').single();

  if (error) {
    return errorResponse(res, 'Failed to create department.', 500);
  }

  return successResponse(res, data, 201);
});

// GET /api/departments/:id — Get department
router.get('/:id', authenticate, async (req, res) => {
  const { data: dept, error } = await supabase
    .from('departments')
    .select('*, users!departments_manager_id_fkey(id, first_name, last_name, email)')
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .single();

  if (error || !dept) {
    return errorResponse(res, 'Department not found.', 404);
  }

  // Get member count
  const { count } = await supabase
    .from('department_members')
    .select('id', { count: 'exact', head: true })
    .eq('dept_id', dept.id);

  return successResponse(res, { ...dept, memberCount: count || 0 });
});

// PUT /api/departments/:id — Update department
router.put('/:id', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), validate(updateDepartmentSchema), async (req, res) => {
  const updates = {};
  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.managerId !== undefined) updates.manager_id = req.body.managerId;

  const { data, error } = await supabase
    .from('departments')
    .update(updates)
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update department.', 500);
  }

  return successResponse(res, data);
});

// DELETE /api/departments/:id — Delete department
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id);

  if (error) {
    return errorResponse(res, 'Failed to delete department.', 500);
  }

  return successResponse(res, { message: 'Department deleted successfully.' });
});

// GET /api/departments/:id/members — List members
router.get('/:id/members', authenticate, async (req, res) => {
  const { data, error } = await supabase
    .from('department_members')
    .select('id, role, joined_at, users(id, email, first_name, last_name, role, avatar_url, is_active)')
    .eq('dept_id', req.params.id);

  if (error) {
    return errorResponse(res, 'Failed to fetch members.', 500);
  }

  return successResponse(res, data);
});

// POST /api/departments/:id/members — Add member
router.post('/:id/members', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), validate(addMemberSchema), async (req, res) => {
  const { userId, role } = req.body;

  // Check if already a member
  const { data: existing } = await supabase
    .from('department_members')
    .select('id')
    .eq('dept_id', req.params.id)
    .eq('user_id', userId)
    .single();

  if (existing) {
    return errorResponse(res, 'User is already a member of this department.', 409);
  }

  const { data, error } = await supabase.from('department_members').insert({
    id: uuidv4(),
    dept_id: req.params.id,
    user_id: userId,
    role,
  }).select('*').single();

  if (error) {
    return errorResponse(res, 'Failed to add member.', 500);
  }

  return successResponse(res, data, 201);
});

// DELETE /api/departments/:id/members/:userId — Remove member
router.delete('/:id/members/:userId', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), async (req, res) => {
  const { error } = await supabase
    .from('department_members')
    .delete()
    .eq('dept_id', req.params.id)
    .eq('user_id', req.params.userId);

  if (error) {
    return errorResponse(res, 'Failed to remove member.', 500);
  }

  return successResponse(res, { message: 'Member removed successfully.' });
});

module.exports = router;
