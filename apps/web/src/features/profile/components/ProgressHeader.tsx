import React from 'react';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_TITLES = [
  'Identity & Personal Info',
  'Target Role & Seniority',
  'Location & Work Mode',
  'Salary & Search Status',
];

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({ currentStep, totalSteps }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
          Step {currentStep} of {totalSteps} — {STEP_TITLES[currentStep - 1]}
        </span>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#3b82f6' }}>{percentage}%</span>
      </div>
      <div style={{ height: '8px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: '#3b82f6',
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};
