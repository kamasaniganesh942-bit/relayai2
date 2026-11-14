const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/database');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, assignTaskSchema } = require('../validators/tasks');
const { successResponse, errorResponse, parsePagination, buildPagination } = require('../utils/helpers');

const router = express.Router();

// GET /api/tasks/kanban — Kanban view (must be before /:id)
router.get('/kanban', authenticate, async (req, res) => {
  const orgId = req.user.org_id;

  let query = supabase
    .from('tasks')
    .select(`
      *,
      assignee:users!tasks_assigned_to_fkey(id, first_name, last_name, avatar_url),
      department:departments!tasks_dept_id_fkey(id, name)
    `)
    .eq('org_id', orgId)
    .order('updated_at', { ascending: false });

  if (req.query.deptId) query = query.eq('dept_id', req.query.deptId);
  if (req.query.assignedTo) query = query.eq('assigned_to', req.query.assignedTo);

  const { data, error } = await query;

  if (error) {
    return errorResponse(res, 'Failed to fetch kanban data.', 500);
  }

  const statuses = ['new', 'under_review', 'assigned', 'in_progress', 'waiting_approval', 'blocked', 'completed', 'rejected'];
  const kanban = {};
  for (const s of statuses) {
    kanban[s] = (data || []).filter((t) => t.status === s);
  }

  return successResponse(res, kanban);
});

// GET /api/tasks — List tasks
router.get('/', authenticate, async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const orgId = req.user.org_id;

  let query = supabase
    .from('tasks')
    .select(`
      *,
      assignee:users!tasks_assigned_to_fkey(id, first_name, last_name, email, avatar_url),
      assigner:users!tasks_assigned_by_fkey(id, first_name, last_name),
      department:departments!tasks_dept_id_fkey(id, name)
    `, { count: 'exact' })
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (req.query.status) query = query.eq('status', req.query.status);
  if (req.query.priority) query = query.eq('priority', req.query.priority);
  if (req.query.assignedTo) query = query.eq('assigned_to', req.query.assignedTo);
  if (req.query.deptId) query = query.eq('dept_id', req.query.deptId);
  if (req.query.requestId) query = query.eq('request_id', req.query.requestId);
  if (req.query.search) {
    query = query.or(`title.ilike.%${req.query.search}%,description.ilike.%${req.query.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return errorResponse(res, 'Failed to fetch tasks.', 500);
  }

  return successResponse(res, data, 200, buildPagination(page, limit, count || 0));
});

// POST /api/tasks — Create task
router.post('/', authenticate, validate(createTaskSchema), async (req, res) => {
  const { title, description, requestId, priority, assignedTo, deptId, deadline, estimatedHours } = req.body;
  const orgId = req.user.org_id;

  const { data, error } = await supabase.from('tasks').insert({
    id: uuidv4(),
    org_id: orgId,
    request_id: requestId || null,
    title,
    description,
    status: assignedTo ? 'assigned' : 'new',
    priority,
    assigned_to: assignedTo || null,
    assigned_by: assignedTo ? req.user.id : null,
    dept_id: deptId || null,
    deadline: deadline || null,
    estimated_hours: estimatedHours || null,
  }).select('*').single();

  if (error) {
    return errorResponse(res, 'Failed to create task.', 500);
  }

  return successResponse(res, data, 201);
});

// GET /api/tasks/:id — Get task detail
router.get('/:id', authenticate, async (req, res) => {
  const { data: task, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:users!tasks_assigned_to_fkey(id, first_name, last_name, email, avatar_url),
      assigner:users!tasks_assigned_by_fkey(id, first_name, last_name),
      department:departments!tasks_dept_id_fkey(id, name),
      request:requests!tasks_request_id_fkey(id, title, status)
    `)
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .single();

  if (error || !task) {
    return errorResponse(res, 'Task not found.', 404);
  }

  // Get comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, users(id, first_name, last_name, avatar_url)')
    .eq('entity_type', 'task')
    .eq('entity_id', req.params.id)
    .order('created_at', { ascending: true });

  // Get attachments
  const { data: attachments } = await supabase
    .from('attachments')
    .select('*')
    .eq('entity_type', 'task')
    .eq('entity_id', req.params.id)
    .order('created_at', { ascending: false });

  // Get dependencies
  const { data: dependencies } = await supabase
    .from('task_dependencies')
    .select('*, depends_on:tasks!task_dependencies_depends_on_task_id_fkey(id, title, status)')
    .eq('task_id', req.params.id);

  return successResponse(res, {
    ...task,
    comments: comments || [],
    attachments: attachments || [],
    dependencies: dependencies || [],
  });
});

// PUT /api/tasks/:id — Update task
router.put('/:id', authenticate, validate(updateTaskSchema), async (req, res) => {
  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.priority !== undefined) updates.priority = req.body.priority;
  if (req.body.deadline !== undefined) updates.deadline = req.body.deadline;
  if (req.body.estimatedHours !== undefined) updates.estimated_hours = req.body.estimatedHours;
  if (req.body.actualHours !== undefined) updates.actual_hours = req.body.actualHours;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update task.', 500);
  }

  return successResponse(res, data);
});

// DELETE /api/tasks/:id — Delete task
router.delete('/:id', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), async (req, res) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id);

  if (error) {
    return errorResponse(res, 'Failed to delete task.', 500);
  }

  return successResponse(res, { message: 'Task deleted successfully.' });
});

// POST /api/tasks/:id/assign — Assign task
router.post('/:id/assign', authenticate, authorize('super_admin', 'org_admin', 'dept_manager'), validate(assignTaskSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      assigned_to: req.body.assignedTo,
      assigned_by: req.user.id,
      status: 'assigned',
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to assign task.', 500);
  }

  return successResponse(res, data);
});

// PUT /api/tasks/:id/status — Update task status
router.put('/:id/status', authenticate, validate(updateTaskStatusSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: req.body.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .eq('org_id', req.user.org_id)
    .select('*')
    .single();

  if (error) {
    return errorResponse(res, 'Failed to update task status.', 500);
  }

  return successResponse(res, data);
});

module.exports = router;
