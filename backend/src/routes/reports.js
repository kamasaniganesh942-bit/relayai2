const express = require('express');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { reportGenerator } = require('../ai/reportGenerator');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/reports — List all reports for the organization
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  const { data, count, error } = await supabase
    .from('reports')
    .select('*', { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return errorResponse(res, 'Failed to fetch reports.', 500);
  }

  return successResponse(res, data || [], 200, buildPagination(page, limit, count || 0));
});

// GET /api/reports/:id — Get report details
router.get('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const orgId = req.user.org_id;

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', id)
    .eq('org_id', orgId)
    .single();

  if (error || !data) {
    return errorResponse(res, 'Report not found.', 404);
  }

  return successResponse(res, data);
});

// POST /api/reports/generate — Generate report
router.post('/generate', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), async (req, res) => {
  const { type, parameters } = req.body;
  const orgId = req.user.org_id;
  const userId = req.user.id;

  if (!type) {
    return errorResponse(res, 'Report type is required.', 400);
  }

  const result = await reportGenerator.generateReport(orgId, type, {
    ...parameters,
    generatedBy: userId
  });

  if (!result.success) {
    return errorResponse(res, result.error || 'Failed to generate report.', 500);
  }

  return successResponse(res, result.report, 201);
});

module.exports = router;

