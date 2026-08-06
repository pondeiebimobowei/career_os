import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { ProgressHeader } from './ProgressHeader';
import { Step1IdentityForm } from './Step1IdentityForm';
import { Step2RoleForm } from './Step2RoleForm';
import { Step3LocationForm } from './Step3LocationForm';
import { Step4SearchStatusForm } from './Step4SearchStatusForm';

export const OnboardingLayout: React.FC = () => {
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
      <div
        style={{
          maxWidth: '560px',
          margin: '60px auto',
          padding: '32px',
          borderRadius: '12px',
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px 0', color: '#1e293b' }}>
          Profile Onboarding Completed!
        </h2>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
          Your profile preferences have been successfully saved to CareerOS. You are now ready to track job applications, optimize resumes, and accelerate your job search.
        </p>
        <button
          onClick={() => (window.location.href = '/')}
          style={{
            padding: '12px 24px',
            borderRadius: '6px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            fontWeight: 600,
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          Go to Executive Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '32px',
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <ProgressHeader currentStep={currentStep} totalSteps={4} />

      {currentStep === 1 && <Step1IdentityForm data={formData} errors={errors} updateFields={updateFields} />}
      {currentStep === 2 && <Step2RoleForm data={formData} errors={errors} updateFields={updateFields} />}
      {currentStep === 3 && <Step3LocationForm data={formData} updateFields={updateFields} />}
      {currentStep === 4 && <Step4SearchStatusForm data={formData} updateFields={updateFields} />}

      {errors.submit && (
        <div
          style={{
            marginTop: '16px',
            padding: '10px',
            borderRadius: '6px',
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            fontSize: '13px',
          }}
        >
          {errors.submit}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
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
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={submitForm}
            disabled={isSubmitting}
            style={{
              padding: '10px 24px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#22c55e',
              color: '#ffffff',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            {isSubmitting ? 'Saving Profile...' : 'Complete Onboarding'}
          </button>
        )}
      </div>
    </div>
  );
};
