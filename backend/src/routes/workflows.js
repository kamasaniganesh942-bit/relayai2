const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { createWorkflowSchema, updateWorkflowSchema } = require('../validators/workflows');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/workflows — List all workflow rules
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  const { data, count, error } = await supabase
    .from('workflow_rules')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return errorResponse(res, 'Failed to fetch workflow rules.', 500);
  }

  return successResponse(res, data || [], 200, buildPagination(page, limit, count || 0));
});

// GET /api/workflows/:id — Get rule details
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const orgId = req.user.org_id;

  const { data, error } = await supabase
    .from('workflow_rules')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .single();

  if (error || !data) {
    return errorResponse(res, 'Workflow rule not found.', 404);
  }

  return successResponse(res, data);
});

// POST /api/workflows — Create workflow rule
router.post('/', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), validate(createWorkflowSchema), async (req, res) => {
  const orgId = req.user.org_id;
  const { name, description, triggerEvent, conditions, actions, isActive } = req.body;

  const newRule = {
    id: uuidv4(),
    org_id: orgId,
    name,
    description: description || '',
    trigger_event: triggerEvent,
    conditions: Array.isArray(conditions) ? conditions : Object.keys(conditions).length ? [conditions] : [],
    actions: Array.isArray(actions) ? actions : Object.keys(actions).length ? [actions] : [],
    is_active: isActive !== undefined ? isActive : true,
    execution_count: 0
  };

  const { data, error } = await supabase
    .from('workflow_rules')
    .insert(newRule)
    .select()
    .single();

  if (error) {
    return errorResponse(res, 'Failed to create workflow rule.', 500);
  }

  return successResponse(res, data, 201);
});

// PUT /api/workflows/:id — Update workflow rule
router.put('/:id', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), validate(updateWorkflowSchema), async (req, res) => {
  const { id } = req.params;
  const orgId = req.user.org_id;
  const updates = {};

  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.triggerEvent !== undefined) updates.trigger_event = req.body.triggerEvent;
  if (req.body.conditions !== undefined) updates.conditions = Array.isArray(req.body.conditions) ? req.body.conditions : [req.body.conditions];
  if (req.body.actions !== undefined) updates.actions = Array.isArray(req.body.actions) ? req.body.actions : [req.body.actions];
  if (req.body.isActive !== undefined) updates.is_active = req.body.isActive;

  const { data, error } = await supabase
    .from('workflow_rules')
    .update(updates)
    .eq('id', id)
    .eq('org_id', orgId)
    .select()
    .single();

  if (error || !data) {
    return errorResponse(res, 'Failed to update workflow rule.', 500);
  }

  return successResponse(res, data);
});

// DELETE /api/workflows/:id — Delete workflow rule
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin'), async (req, res) => {
  const { id } = req.params;
  const orgId = req.user.org_id;

  const { error } = await supabase
    .from('workflow_rules')
    .delete()
    .eq('id', id)
    .eq('org_id', orgId);

  if (error) {
    return errorResponse(res, 'Failed to delete workflow rule.', 500);
  }

  return successResponse(res, { message: 'Workflow rule successfully deleted.' });
});

module.exports = router;

