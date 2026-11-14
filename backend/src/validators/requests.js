const { z } = require('zod');

const createRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  category: z.string().max(100).optional().nullable(),
  assignedDept: z.string().uuid().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
});

const updateRequestSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(['new', 'in_review', 'approved', 'in_progress', 'completed', 'rejected', 'closed']).optional(),
  priority: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  category: z.string().max(100).optional().nullable(),
  deadline: z.string().datetime().optional().nullable(),
});

const assignRequestSchema = z.object({
  assignedDept: z.string().uuid().optional().nullable(),
  assignedTo: z.string().uuid().optional().nullable(),
});

module.exports = { createRequestSchema, updateRequestSchema, assignRequestSchema };
