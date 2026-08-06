import React from 'react';
import type { OnboardingData, SearchStatus } from '../types';

interface Step4Props {
  data: OnboardingData;
  updateFields: (fields: Partial<OnboardingData>) => void;
}

const SEARCH_STATUSES: { label: string; value: SearchStatus }[] = [
  { label: 'Actively Looking & Applying', value: 'ACTIVELY_LOOKING' },
  { label: 'Open to Offers (Passive)', value: 'OPEN_TO_OFFERS' },
  { label: 'Casually Browsing', value: 'CASUALLY_BROWSING' },
  { label: 'Not Looking Right Now', value: 'NOT_LOOKING' },
];

export const Step4SearchStatusForm: React.FC<Step4Props> = ({ data, updateFields }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 m-0">Salary Expectations & Search Status</h2>
        <p className="text-slate-500 text-sm mt-1 mb-0">
          Help us surface opportunities matching your compensation goals.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Current Search Status *
        </label>
        <div className="flex flex-col gap-2.5 pt-1">
          {SEARCH_STATUSES.map((status) => (
            <label
              key={status.value}
              className={`flex items-center gap-3 p-3.5 rounded-lg border text-sm font-medium cursor-pointer transition-colors select-none ${
                data.searchStatus === status.value
                  ? 'border-blue-300 bg-blue-50/60 text-slate-900'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="searchStatus"
                checked={data.searchStatus === status.value}
                onChange={() => updateFields({ searchStatus: status.value })}
                className="text-blue-600 focus:ring-blue-500/20 h-4 w-4 cursor-pointer"
              />
              {status.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
