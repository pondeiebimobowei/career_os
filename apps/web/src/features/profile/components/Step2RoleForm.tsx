import React from 'react';
import type { OnboardingData, SeniorityLevel } from '../types';

interface Step2Props {
  data: OnboardingData;
  errors: Record<string, string>;
  updateFields: (fields: Partial<OnboardingData>) => void;
}

const SENIORITY_OPTIONS: SeniorityLevel[] = ['ENTRY', 'MID', 'SENIOR', 'LEAD', 'EXECUTIVE'];

export const Step2RoleForm: React.FC<Step2Props> = ({ data, errors, updateFields }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 m-0">Target Role & Seniority</h2>
        <p className="text-slate-500 text-sm mt-1 mb-0">
          Specify the role titles and seniority level you are targeting in your search.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Target Role Title *
        </label>
        <input
          type="text"
          value={data.targetRole}
          onChange={(e) => updateFields({ targetRole: e.target.value })}
          placeholder="e.g. Senior Fullstack Engineer"
          className={`w-full px-3.5 py-2.5 rounded-lg border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.targetRole
              ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-300 focus:ring-blue-500/20 focus:border-blue-500'
          }`}
        />
        {errors.targetRole && <span className="text-red-500 text-xs mt-1 block font-medium">{errors.targetRole}</span>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Target Seniority *
        </label>
        <div className="flex gap-2 flex-wrap pt-1">
          {SENIORITY_OPTIONS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => updateFields({ seniority: lvl })}
              className={`px-4 py-2 rounded-full font-semibold text-xs transition-colors cursor-pointer ${
                data.seniority === lvl
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
