const { z } = require('zod');

const updateOrgSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  settings: z.record(z.any()).optional(),
});

const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: z.enum(['org_admin', 'dept_manager', 'employee']).default('employee'),
  departmentId: z.string().uuid().optional().nullable(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.enum(['org_admin', 'dept_manager', 'employee']).optional(),
  isActive: z.boolean().optional(),
});

module.exports = { updateOrgSchema, createUserSchema, updateUserSchema };
