const { z } = require('zod');

const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Workflow name is required').max(200),
  description: z.string().optional().default(''),
  triggerEvent: z.string().min(1, 'Trigger event is required'),
  conditions: z.record(z.any()).default({}),
  actions: z.record(z.any()).default({}),
  isActive: z.boolean().default(true),
});

const updateWorkflowSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  triggerEvent: z.string().optional(),
  conditions: z.record(z.any()).optional(),
  actions: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
});

module.exports = { createWorkflowSchema, updateWorkflowSchema };
