const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { createRequestSchema, updateRequestSchema, assignRequestSchema } = require('../validators/requests');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/requests — List requests
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  let query = supabase
    .from('requests')
    .select(`
      *,
      submitted_user:users!requests_submitted_by_fkey(id, first_name, last_name, email),
      assigned_user:users!requests_assigned_to_fkey(id, first_name, last_name, email),
      department:departments!requests_assigned_dept_fkey(id, name)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (req.query.status) query = query.eq('status', req.query.status);
  if (req.query.priority) query = query.eq('priority', req.query.priority);
  if (req.query.assignedDept) query = query.eq('assigned_dept', req.query.assignedDept);
  if (req.query.submittedBy) query = query.eq('submitted_by', req.query.submittedBy);
  if (req.query.startDate) query = query.gte('created_at', req.query.startDate);
  if (req.query.endDate) query = query.lte('created_at', req.query.endDate);
  if (req.query.search) {
    query = query.or(`title.ilike.%${req.query.search}%,description.ilike.%${req.query.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return errorResponse(res, 'Failed to fetch requests.', 500);
  }

  return successResponse(res, data, 200, buildPagination(page, limit, count || 0));
});

// POST /api/requests — Create request
router.post('/', authenticate, validate(createRequestSchema), async (req, res) => {
  const { title, description, priority, category, assignedDept, assignedTo, deadline } = req.body;
  const orgId = req.user.org_id;

  const { data, error } = await supabase.from('requests').insert({
    id: uuidv4(),
    org_id: orgId,
    title,
    description,
    submitted_by: req.user.id,
    status: 'new',
    priority,
    category,
    assigned_dept: assignedDept || null,
    assigned_to: assignedTo || null,
    deadline: deadline || null,
  }).select('*').single();

  if (error) {
    return errorResponse(res, 'Failed to create request.', 500);
  }

  return successResponse(res, data, 201);
});

// GET /api/requests/:id — Get request details
router.get('/:id', authenticate, async (req, res) => {
  const { data: request, error } = await supabase
    .from('requests')
    .select(`
      *,
      submitted_user:users!requests_submitted_by_fkey(id, first_name, last_name, email, avatar_url),
      assigned_user:users!requests_assigned_to_fkey(id, first_name, last_name, email, avatar_url),
      department:departments!requests_assigned_dept_fkey(id, name)
    `)
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .single();

  if (error || !request) {
    return errorResponse(res, 'Request not found.', 404);
  }

  // Get comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, users(id, first_name, last_name, avatar_url)')
    .eq('entity_type', 'request')
    .eq('entity_id', req.params.id)
    .order('created_at', { ascending: true });

  // Get attachments
  const { data: attachments } = await supabase
    .from('attachments')
    .select('*')
    .eq('entity_type', 'request')
    .eq('entity_id', req.params.id)
    .order('created_at', { ascending: false });

  return successResponse(res, {
    ...request,
    comments: comments || [],
    attachments: attachments || [],
  });
});

// PUT /api/requests/:id — Update request
router.put('/:id', authenticate, validate(updateRequestSchema), async (req, res) => {
  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.status !== undefined) updates.status = req.body.status;
  if (req.body.priority !== undefined) updates.priority = req.body.priority;
  if (req.body.category !== undefined) updates.category = req.body.category;
  if (req.body.deadline !== undefined) updates.deadline = req.body.deadline;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('requests')
    .update(updates)
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update request.', 500);
  }

  return successResponse(res, data);
});

// DELETE /api/requests/:id — Delete request (admin only)
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { error } = await supabase
    .from('requests')
    .delete()
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id);

  if (error) {
    return errorResponse(res, 'Failed to delete request.', 500);
  }

  return successResponse(res, { message: 'Request deleted successfully.' });
});

// POST /api/requests/:id/assign — Assign request
router.post('/:id/assign', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), validate(assignRequestSchema), async (req, res) => {
  const updates = { updated_at: new Date().toISOString() };
  if (req.body.assignedDept !== undefined) updates.assigned_dept = req.body.assignedDept;
  if (req.body.assignedTo !== undefined) updates.assigned_to = req.body.assignedTo;
  if (updates.assigned_to || updates.assigned_dept) {
    updates.status = 'in_review';
  }

  const { data, error } = await supabase
    .from('requests')
    .update(updates)
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to assign request.', 500);
  }

  return successResponse(res, data);
});

module.exports = router;
