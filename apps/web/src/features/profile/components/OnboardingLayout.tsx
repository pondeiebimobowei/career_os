import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { ProgressHeader } from './ProgressHeader';
import { Step1IdentityForm } from './Step1IdentityForm';
import { Step2RoleForm } from './Step2RoleForm';
import { Step3LocationForm } from './Step3LocationForm';
import { Step4SearchStatusForm } from './Step4SearchStatusForm';

interface OnboardingLayoutProps {
  onComplete?: () => void;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ onComplete }) => {
  const {
    currentStep,
    formData,
    errors,
    isSubmitting,
    isSuccess,
    updateFields,
    nextStep,
    prevStep,
    submitForm,
  } = useOnboarding('demo-user');

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto my-14 p-8 rounded-xl bg-white shadow-xl text-center border border-slate-100">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-3 text-slate-800">
          Profile Onboarding Completed!
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          Your profile preferences have been successfully saved to CareerOS. You are now ready to track job applications, optimize resumes, and accelerate your job search.
        </p>
        <button
          onClick={() => {
            if (onComplete) onComplete();
            else window.location.href = '/';
          }}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Go to Executive Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto my-10 p-8 rounded-xl bg-white shadow-xl border border-slate-100 font-sans">
      <ProgressHeader currentStep={currentStep} totalSteps={4} />

      {currentStep === 1 && <Step1IdentityForm data={formData} errors={errors} updateFields={updateFields} />}
      {currentStep === 2 && <Step2RoleForm data={formData} errors={errors} updateFields={updateFields} />}
      {currentStep === 3 && <Step3LocationForm data={formData} updateFields={updateFields} />}
      {currentStep === 4 && <Step4SearchStatusForm data={formData} updateFields={updateFields} />}

      {errors.submit && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-500 text-xs font-medium border border-red-100">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submitForm}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Saving Profile...' : 'Complete Onboarding'}
          </button>
        )}
      </div>
    </div>
  );
};
