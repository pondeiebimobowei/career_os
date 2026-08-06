import React from 'react';
import type { OnboardingData } from '../types';

interface Step1Props {
  data: OnboardingData;
  errors: Record<string, string>;
  updateFields: (fields: Partial<OnboardingData>) => void;
}

export const Step1IdentityForm: React.FC<Step1Props> = ({ data, errors, updateFields }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 m-0">Let's start with your details</h2>
        <p className="text-slate-500 text-sm mt-1 mb-0">
          This helps personalize your job tracking dashboard and application materials.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Full Name *
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => updateFields({ fullName: e.target.value })}
          placeholder="e.g. Alex Chen"
          className={`w-full px-3.5 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.fullName
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
          }`}
        />
        {errors.fullName && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.fullName}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Timezone *
        </label>
        <input
          type="text"
          value={data.timezone}
          onChange={(e) => updateFields({ timezone: e.target.value })}
          className={`w-full px-3.5 py-2.5 rounded-lg border text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
            errors.timezone
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
          }`}
        />
        {errors.timezone && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.timezone}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Professional Bio (Optional)
        </label>
        <textarea
          rows={3}
          value={data.bio || ''}
          onChange={(e) => updateFields({ bio: e.target.value })}
          placeholder="Brief summary of your expertise and goals..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
};
