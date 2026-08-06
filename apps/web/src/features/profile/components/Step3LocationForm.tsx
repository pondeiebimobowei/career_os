import React from 'react';
import type { OnboardingData, RemotePreference } from '../types';

interface Step3Props {
  data: OnboardingData;
  updateFields: (fields: Partial<OnboardingData>) => void;
}

const REMOTE_OPTIONS: { label: string; value: RemotePreference }[] = [
  { label: 'Remote Only', value: 'REMOTE_ONLY' },
  { label: 'Hybrid', value: 'HYBRID' },
  { label: 'Onsite', value: 'ONSITE' },
  { label: 'Open to All', value: 'OPEN' },
];

export const Step3LocationForm: React.FC<Step3Props> = ({ data, updateFields }) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 m-0">Location & Remote Work Preferences</h2>
        <p className="text-slate-500 text-sm mt-1 mb-0">
          Configure location criteria to filter job recommendations and salary benchmarks.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Work Arrangement *
        </label>
        <div className="flex gap-2 flex-wrap pt-1">
          {REMOTE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateFields({ remotePreference: opt.value })}
              className={`px-4 py-2.5 rounded-lg border font-semibold text-xs transition-colors cursor-pointer ${
                data.remotePreference === opt.value
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2.5 mt-2 cursor-pointer">
        <input
          type="checkbox"
          id="relocation"
          checked={data.openToRelocation}
          onChange={(e) => updateFields({ openToRelocation: e.target.checked })}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 h-4 w-4 cursor-pointer"
        />
        <label htmlFor="relocation" className="text-sm font-medium text-slate-700 cursor-pointer select-none">
          Open to relocation for the right offer
        </label>
      </div>
    </div>
  );
};
