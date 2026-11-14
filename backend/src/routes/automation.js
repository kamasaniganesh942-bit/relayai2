const express = require('express');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { automationEngine } = require('../automation/engine');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/automation/logs — Execution logs
router.get('/logs', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  const { data, count, error } = await supabase
    .from('automation_logs')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .order('executed_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return errorResponse(res, 'Failed to fetch automation logs.', 500);
  }

  return successResponse(res, data || [], 200, buildPagination(page, limit, count || 0));
});

// POST /api/automation/trigger — Manually trigger rules evaluation
router.post('/trigger', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), async (req, res) => {
  const orgId = req.user.org_id;
  const { event, entityData } = req.body;

  if (!event || !entityData) {
    return errorResponse(res, 'Event and entityData are required.', 400);
  }

  const result = await automationEngine.evaluateEvent(event, entityData, orgId);
  return successResponse(res, result);
});

module.exports = router;

