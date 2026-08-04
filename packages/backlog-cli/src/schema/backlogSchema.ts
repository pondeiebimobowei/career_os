import { z } from 'zod';
import { PriorityEnum, IssueTypeEnum } from './enums.js';

export const PrioritySchema = z.nativeEnum(PriorityEnum);
export const IssueTypeSchema = z.union([z.nativeEnum(IssueTypeEnum), z.string()]);

export const IssueSchema = z.object({
  id: z.string().min(1, 'Issue ID must not be empty'),
  title: z.string().min(1, 'Issue title must not be empty'),
  type: IssueTypeSchema.optional(),
  priority: PrioritySchema.optional(),
  estimate: z.union([z.number(), z.string()]).optional(),
  dependencies: z.array(z.string()).optional(),
  labels: z.array(z.string()).optional(),
  acceptance_criteria: z.array(z.string()).optional(),
  definition_of_done: z.array(z.string()).optional(),
});

export const FeatureSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  priority: PrioritySchema.optional(),
  issues: z.array(IssueSchema).default([]),
});

export const EpicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  type: z.string().optional(),
  milestone: z.string().optional(),
  objective: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  features: z.array(FeatureSchema).default([]),
});
