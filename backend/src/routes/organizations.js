const express = require('express');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { updateOrgSchema } = require('../validators/organizations');
const { successResponse, errorResponse } = require('../utils/helpers');

const router = express.Router();

// GET /api/organizations — Get current org
router.get('/', authenticate, async (req, res) => {
  const { data: org, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', req.user.org_id)
    .single();

  if (error || !org) {
    return errorResponse(res, 'Organization not found.', 404);
  }

  return successResponse(res, org);
});

// PUT /api/organizations — Update org
router.put('/', authenticate, authorize('super_admin', 'org_admin'), validate(updateOrgSchema), async (req, res) => {
  const updates = {};
  if (req.body.name !== undefined) updates.name = req.body.name;
  if (req.body.settings !== undefined) updates.settings = req.body.settings;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('organizations')
    .update(updates)
    .eq('id', req.user.org_id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update organization.', 500);
  }

  return successResponse(res, data);
});

// GET /api/organizations/stats — Org-wide stats
router.get('/stats', authenticate, async (req, res) => {
  const orgId = req.user.org_id;

  const [usersRes, deptsRes, requestsRes, tasksRes] = await Promise.all([
    supabase.from('users').select('id', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('departments').select('id', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('requests').select('id', { count: 'exact', head: true }).eq('org_id', orgId),
    supabase.from('tasks').select('id', { count: 'exact', head: true }).eq('org_id', orgId),
  ]);

  return successResponse(res, {
    totalUsers: usersRes.count || 0,
    totalDepartments: deptsRes.count || 0,
    totalRequests: requestsRes.count || 0,
    totalTasks: tasksRes.count || 0,
  });
});

module.exports = router;
