const { z } = require('zod');

const createDepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').max(200),
  description: z.string().optional().default(''),
  managerId: z.string().uuid().optional().nullable(),
});

const updateDepartmentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  managerId: z.string().uuid().optional().nullable(),
});

const addMemberSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: z.string().max(50).optional().default('member'),
});

module.exports = { createDepartmentSchema, updateDepartmentSchema, addMemberSchema };
