import React from 'react';
import { OnboardingLayout } from '../components/OnboardingLayout';

interface OnboardingPageProps {
  onComplete?: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5">
      <OnboardingLayout onComplete={onComplete} />
    </div>
  );
};
