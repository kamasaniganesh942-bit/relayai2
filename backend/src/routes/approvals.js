const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createApprovalSchema, updateApprovalSchema } = require('../validators/approvals');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/approvals — List approvals for current user
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  let query = supabase
    .from('approvals')
    .select(`
      *,
      requester:users!approvals_requested_by_fkey(id, first_name, last_name, email, avatar_url),
      approver:users!approvals_assigned_to_fkey(id, first_name, last_name, email, avatar_url)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Default to showing approvals assigned to current user
  if (req.query.assignedTo) {
    query = query.eq('assigned_to', req.query.assignedTo);
  } else if (req.query.all !== 'true') {
    query = query.eq('assigned_to', req.user.id);
  }

  if (req.query.status) {
    query = query.eq('status', req.query.status);
  } else {
    // Default: pending
    query = query.eq('status', 'pending');
  }

  const { data, error, count } = await query;

  if (error) {
    return errorResponse(res, 'Failed to fetch approvals.', 500);
  }

  return successResponse(res, data, 200, buildPagination(page, limit, count || 0));
});

// POST /api/approvals — Create approval request
router.post('/', authenticate, validate(createApprovalSchema), async (req, res) => {
  const { entityType, entityId, assignedTo } = req.body;
  const orgId = req.user.org_id;

  const { data, error } = await supabase.from('approvals').insert({
    id: uuidv4(),
    org_id: orgId,
    entity_type: entityType,
    entity_id: entityId,
    requested_by: req.user.id,
    assigned_to: assignedTo,
    status: 'pending',
  }).select('*').single();

  if (error) {
    return errorResponse(res, 'Failed to create approval request.', 500);
  }

  // If entity is a task, update task status to waiting_approval
  if (entityType === 'task') {
    await supabase.from('tasks').update({
      status: 'waiting_approval',
      updated_at: new Date().toISOString(),
    }).eq('id', entityId).eq('org_id', orgId);
  }

  return successResponse(res, data, 201);
});

// PUT /api/approvals/:id — Approve or reject
router.put('/:id', authenticate, validate(updateApprovalSchema), async (req, res) => {
  const { status, decisionNote } = req.body;

  // Ensure the current user is the assigned approver
  const { data: approval } = await supabase
    .from('approvals')
    .select('*')
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .single();

  if (!approval) {
    return errorResponse(res, 'Approval not found.', 404);
  }

  if (approval.assigned_to !== req.user.id && req.user.role !== 'super_admin' && req.user.role !== 'org_admin') {
    return errorResponse(res, 'You are not the assigned approver.', 403);
  }

  if (approval.status !== 'pending') {
    return errorResponse(res, 'This approval has already been processed.', 400);
  }

  const { data, error } = await supabase
    .from('approvals')
    .update({
      status,
      decision_note: decisionNote,
      decided_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update approval.', 500);
  }

  // Update related entity status
  if (approval.entity_type === 'task') {
    const taskStatus = status === 'approved' ? 'completed' : 'rejected';
    await supabase.from('tasks').update({
      status: taskStatus,
      updated_at: new Date().toISOString(),
    }).eq('id', approval.entity_id).eq('org_id', req.user.org_id);
  }

  return successResponse(res, data);
});

module.exports = router;
