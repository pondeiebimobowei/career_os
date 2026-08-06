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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Salary Expectations & Search Status</h2>
      <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
        Help us surface opportunities matching your compensation goals.
      </p>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
          Current Search Status *
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SEARCH_STATUSES.map((status) => (
            <label
              key={status.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: data.searchStatus === status.value ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              <input
                type="radio"
                name="searchStatus"
                checked={data.searchStatus === status.value}
                onChange={() => updateFields({ searchStatus: status.value })}
              />
              {status.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
