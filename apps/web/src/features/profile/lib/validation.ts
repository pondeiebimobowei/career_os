import { z } from 'zod';

export const OnboardingStep1Schema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  timezone: z.string().min(1, 'Timezone is required'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
});

export const OnboardingStep2Schema = z.object({
  targetRole: z.string().min(2, 'Target role is required'),
  seniority: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE']),
  skills: z.array(z.string()).min(1, 'Select at least one core skill'),
});

export const OnboardingStep3Schema = z.object({
  preferredLocations: z.array(z.string()).min(1, 'Select at least one preferred location'),
  remotePreference: z.enum(['REMOTE_ONLY', 'HYBRID', 'ONSITE', 'OPEN']),
  openToRelocation: z.boolean().default(false),
});

export const OnboardingStep4Schema = z.object({
  minSalary: z.number().positive('Minimum salary must be positive').optional(),
  maxSalary: z.number().positive('Maximum salary must be positive').optional(),
  currency: z.string().default('USD'),
  searchStatus: z.enum(['ACTIVELY_LOOKING', 'OPEN_TO_OFFERS', 'CASUALLY_BROWSING', 'NOT_LOOKING']),
});

export const CompleteOnboardingProfileSchema = OnboardingStep1Schema
  .merge(OnboardingStep2Schema)
  .merge(OnboardingStep3Schema)
  .merge(OnboardingStep4Schema);
