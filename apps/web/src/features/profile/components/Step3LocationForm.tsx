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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Location & Remote Work Preferences</h2>
      <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
        Configure location criteria to filter job recommendations and salary benchmarks.
      </p>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
          Work Arrangement *
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {REMOTE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateFields({ remotePreference: opt.value })}
              style={{
                padding: '10px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: data.remotePreference === opt.value ? '#3b82f6' : '#ffffff',
                color: data.remotePreference === opt.value ? '#ffffff' : '#334155',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
        <input
          type="checkbox"
          id="relocation"
          checked={data.openToRelocation}
          onChange={(e) => updateFields({ openToRelocation: e.target.checked })}
        />
        <label htmlFor="relocation" style={{ fontSize: '14px', color: '#334155' }}>
          Open to relocation for the right offer
        </label>
      </div>
    </div>
  );
};
