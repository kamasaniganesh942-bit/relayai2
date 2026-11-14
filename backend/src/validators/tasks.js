const { z } = require('zod');

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().optional().default(''),
  requestId: z.string().uuid().optional().nullable(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  assignedTo: z.string().uuid().optional().nullable(),
  deptId: z.string().uuid().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
  estimatedHours: z.number().positive().optional().nullable(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  deadline: z.string().datetime().optional().nullable(),
  estimatedHours: z.number().positive().optional().nullable(),
  actualHours: z.number().min(0).optional().nullable(),
});

const updateTaskStatusSchema = z.object({
  status: z.enum([
    'new', 'under_review', 'assigned', 'in_progress',
    'waiting_approval', 'blocked', 'completed', 'rejected',
  ]),
});

const assignTaskSchema = z.object({
  assignedTo: z.string().uuid('Invalid user ID'),
});

module.exports = { createTaskSchema, updateTaskSchema, updateTaskStatusSchema, assignTaskSchema };
