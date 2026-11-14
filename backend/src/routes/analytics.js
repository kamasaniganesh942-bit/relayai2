const express = require('express');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../utils/helpers');

const router = express.Router();

// GET /api/analytics/dashboard — Dashboard core metrics
router.get('/dashboard', authenticate, async (req, res) => {
  const orgId = req.user.org_id;

  try {
    const [tasksRes, requestsRes, deptsRes, approvalsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('org_id', orgId),
      supabase.from('requests').select('*').eq('org_id', orgId),
      supabase.from('departments').select('*').eq('org_id', orgId),
      supabase.from('approvals').select('*').eq('org_id', orgId),
    ]);

    const tasks = tasksRes.data || [];
    const requests = requestsRes.data || [];
    const departments = deptsRes.data || [];
    const approvals = approvalsRes.data || [];

    const now = new Date();
    const openTasks = tasks.filter(t => !['completed', 'rejected'].includes(t.status));
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const overdueTasks = tasks.filter(t => t.deadline && new Date(t.deadline) < now && !['completed', 'rejected'].includes(t.status));
    const pendingApprovals = approvals.filter(a => a.status === 'pending');

    // Priority distribution
    const priorityDistribution = [
      { name: 'Critical', value: tasks.filter(t => t.priority === 'critical').length, color: '#ef4444' },
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#f97316' },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#eab308' },
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#22c55e' },
    ];

    // Department workload
    const departmentWorkload = departments.map(d => ({
      name: d.name,
      code: d.code,
      color: d.color || '#4f46e5',
      activeTasks: tasks.filter(t => t.dept_id === d.id && !['completed', 'rejected'].includes(t.status)).length,
      completedTasks: tasks.filter(t => t.dept_id === d.id && t.status === 'completed').length,
    }));

    // 30-Day Completion Trends mock aggregation
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const completionTrends = days.map((day, idx) => ({
      day,
      completed: 4 + (idx * 2) % 7,
      created: 6 + (idx * 3) % 9,
    }));

    return successResponse(res, {
      totalRequests: requests.length,
      openTasks: openTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
      pendingApprovals: pendingApprovals.length,
      avgResolutionHours: 18.5,
      completionRate: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 100,
      priorityDistribution,
      departmentWorkload,
      completionTrends,
      recentRequests: requests.slice(0, 5),
      upcomingDeadlines: tasks.filter(t => t.deadline && new Date(t.deadline) >= now).slice(0, 5)
    });
  } catch (err) {
    console.error('[Analytics] Error:', err);
    return errorResponse(res, 'Failed to compute dashboard analytics.', 500);
  }
});

// GET /api/analytics/department-performance
router.get('/department-performance', authenticate, async (req, res) => {
  const orgId = req.user.org_id;

  try {
    const [tasksRes, deptsRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('org_id', orgId),
      supabase.from('departments').select('*').eq('org_id', orgId),
    ]);

    const tasks = tasksRes.data || [];
    const departments = deptsRes.data || [];

    const performance = departments.map(dept => {
      const deptTasks = tasks.filter(t => t.dept_id === dept.id);
      const completed = deptTasks.filter(t => t.status === 'completed');
      const overdue = deptTasks.filter(t => t.deadline && new Date(t.deadline) < new Date() && t.status !== 'completed');

      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        totalTasks: deptTasks.length,
        completedTasks: completed.length,
        overdueTasks: overdue.length,
        slaCompliance: deptTasks.length ? Math.round(((deptTasks.length - overdue.length) / deptTasks.length) * 100) : 100,
        avgHours: 14.8
      };
    });

    return successResponse(res, performance);
  } catch (err) {
    return errorResponse(res, 'Failed to compute department performance.', 500);
  }
});

// GET /api/analytics/trends
router.get('/trends', authenticate, async (req, res) => {
  const trends = [
    { period: 'Week 1', completed: 18, incoming: 22 },
    { period: 'Week 2', completed: 25, incoming: 27 },
    { period: 'Week 3', completed: 31, incoming: 29 },
    { period: 'Week 4', completed: 38, incoming: 34 },
  ];
  return successResponse(res, trends);
});

module.exports = router;

