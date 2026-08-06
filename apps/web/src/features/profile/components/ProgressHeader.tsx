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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-slate-500">
          Step {currentStep} of {totalSteps} — {STEP_TITLES[currentStep - 1]}
        </span>
        <span className="text-sm font-bold text-blue-600">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
