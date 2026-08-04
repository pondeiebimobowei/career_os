import { z } from 'zod';
import { VALID_PRIORITIES } from './cbs.js';

export const PriorityZodSchema = z.enum(VALID_PRIORITIES);

export const IssueZodSchema = z.object({
  id: z.string().min(1, 'Issue ID must not be empty'),
  title: z.string().min(1, 'Issue title must not be empty'),
  type: z.string().optional(),
  priority: PriorityZodSchema.optional(),
  estimate: z.union([z.number(), z.string()]).optional(),
  dependencies: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  acceptance_criteria: z.array(z.string()).optional(),
  definition_of_done: z.array(z.string()).optional(),
});

export const FeatureZodSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  priority: PriorityZodSchema.optional(),
  issues: z.array(IssueZodSchema).default([]),
});

export const EpicZodSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().optional(),
  milestone: z.string().optional(),
  objective: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  features: z.array(FeatureZodSchema).default([]),
});
