import { useState } from 'react';
import type { OnboardingData } from '../types';
import {
  OnboardingStep1Schema,
  OnboardingStep2Schema,
  OnboardingStep3Schema,
  OnboardingStep4Schema,
} from '../lib/validation';
import { submitOnboardingProfile } from '../api/profileClient';

export function useOnboarding(userId: string = 'demo-user') {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [formData, setFormData] = useState<OnboardingData>({
    fullName: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    bio: '',
    targetRole: '',
    seniority: 'SENIOR',
    skills: ['TypeScript', 'React'],
    preferredLocations: ['Remote'],
    remotePreference: 'REMOTE_ONLY',
    openToRelocation: false,
    minSalary: undefined,
    maxSalary: undefined,
    currency: 'USD',
    searchStatus: 'ACTIVELY_LOOKING',
  });

  const updateFields = (fields: Partial<OnboardingData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    setErrors({});
  };

  const validateCurrentStep = (): boolean => {
    setErrors({});
    let schema;
    if (currentStep === 1) schema = OnboardingStep1Schema;
    else if (currentStep === 2) schema = OnboardingStep2Schema;
    else if (currentStep === 3) schema = OnboardingStep3Schema;
    else schema = OnboardingStep4Schema;

    const result = schema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const submitForm = async () => {
    if (!validateCurrentStep()) return;
    setIsSubmitting(true);
    try {
      await submitOnboardingProfile(userId, formData);
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit profile';
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    updateFields,
    nextStep,
    prevStep,
    submitForm,
  };
}
