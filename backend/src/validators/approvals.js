const { z } = require('zod');

const createApprovalSchema = z.object({
  entityType: z.enum(['task', 'request']),
  entityId: z.string().uuid('Invalid entity ID'),
  assignedTo: z.string().uuid('Invalid approver user ID'),
});

const updateApprovalSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  decisionNote: z.string().optional().default(''),
});

module.exports = { createApprovalSchema, updateApprovalSchema };
