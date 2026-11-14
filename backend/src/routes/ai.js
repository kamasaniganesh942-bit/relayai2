const express = require('express');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { analyzeRequest, suggestDepartment, predictPriority, saveAnalysisRecord } = require('../ai/requestAnalyzer');
const { detectBottlenecks, predictDelays, generateInsights, getDepartmentHealth } = require('../ai/insightsEngine');
const { processQuery } = require('../ai/assistantEngine');
const { reportGenerator } = require('../ai/reportGenerator');
const { supabase } = require('../config/database');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// POST /api/ai/analyze — Classify and analyze request text
router.post('/analyze', authenticate, async (req, res) => {
  const { text, requestId } = req.body;
  const orgId = req.user.org_id;

  if (!text || typeof text !== 'string') {
    return errorResponse(res, 'Request text is required for AI analysis.', 400);
  }

  const analysis = await analyzeRequest(text, `Org ID: ${orgId}`);

  if (analysis.success && requestId) {
    // Record telemetry in ai_analysis_records
    await saveAnalysisRecord(
      orgId,
      'request',
      requestId,
      'classification',
      analysis.data,
      analysis.model,
      analysis.tokensUsed
    );

    // Update request with AI classification
    await supabase
      .from('requests')
      .update({ ai_classification: analysis.data })
      .eq('id', requestId)
      .eq('org_id', orgId);
  }

  return successResponse(res, analysis);
});

// POST /api/ai/route — Suggest department routing
router.post('/route', authenticate, async (req, res) => {
  const { request } = req.body;
  const orgId = req.user.org_id;

  if (!request) {
    return errorResponse(res, 'Request object is required.', 400);
  }

  // Fetch departments & workloads
  const { data: departments } = await supabase
    .from('departments')
    .select('id, name')
    .eq('org_id', orgId);

  const { data: tasks } = await supabase
    .from('tasks')
    .select('dept_id, status')
    .eq('org_id', orgId);

  const workloads = (departments || []).map(d => ({
    department: d.name,
    activeTasks: (tasks || []).filter(t => t.dept_id === d.id && t.status !== 'completed').length,
    pendingRequests: 0,
    avgCompletionDays: 2
  }));

  const result = await suggestDepartment(request, departments || [], workloads);
  return successResponse(res, result);
});

// POST /api/ai/priority — Predict priority level
router.post('/priority', authenticate, async (req, res) => {
  const { request } = req.body;
  const orgId = req.user.org_id;

  if (!request) {
    return errorResponse(res, 'Request object is required.', 400);
  }

  const result = await predictPriority(request, `Org: ${orgId}`);
  return successResponse(res, result);
});

// GET /api/ai/insights — Get organizational operational insights & bottlenecks
router.get('/insights', authenticate, async (req, res) => {
  const orgId = req.user.org_id;
  const insights = await generateInsights(orgId);
  return successResponse(res, insights.data || insights);
});

// GET /api/ai/insights/bottlenecks — Detect bottlenecks
router.get('/insights/bottlenecks', authenticate, async (req, res) => {
  const orgId = req.user.org_id;
  const bottlenecks = await detectBottlenecks(orgId);
  return successResponse(res, bottlenecks.data || bottlenecks);
});

// GET /api/ai/insights/delays — Predict delays for active tasks
router.get('/insights/delays', authenticate, async (req, res) => {
  const orgId = req.user.org_id;
  const delays = await predictDelays(orgId);
  return successResponse(res, delays.data || delays);
});

// GET /api/ai/insights/department/:id — Department health analysis
router.get('/insights/department/:id', authenticate, async (req, res) => {
  const orgId = req.user.org_id;
  const deptId = req.params.id;
  const health = await getDepartmentHealth(orgId, deptId);
  return successResponse(res, health.data || health);
});

// POST /api/ai/assistant — Chat with RELAY INTELLIGENCE
router.post('/assistant', authenticate, async (req, res) => {
  const { message, conversationId } = req.body;
  const userId = req.user.id;
  const orgId = req.user.org_id;

  if (!message || typeof message !== 'string') {
    return errorResponse(res, 'Message text is required.', 400);
  }

  const reply = await processQuery(message, userId, orgId, conversationId);
  return successResponse(res, reply);
});

// GET /api/ai/assistant/history — Get conversation history
router.get('/assistant/history', authenticate, async (req, res) => {
  const userId = req.user.id;
  const orgId = req.user.org_id;

  const { data, error } = await supabase
    .from('conversation_history')
    .select('*')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) {
    return errorResponse(res, 'Failed to fetch conversation history.', 500);
  }

  return successResponse(res, data || []);
});

// POST /api/ai/reports/generate — Generate an AI management report
router.post('/reports/generate', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), async (req, res) => {
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

// GET /api/ai/reports — List saved reports
router.get('/reports', authenticate, async (req, res) => {
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

// GET /api/ai/reports/:id — Get report details
router.get('/reports/:id', authenticate, async (req, res) => {
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

module.exports = router;

