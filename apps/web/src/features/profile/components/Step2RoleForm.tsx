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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Target Role & Seniority</h2>
      <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
        Specify the role titles and seniority level you are targeting in your search.
      </p>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
          Target Role Title *
        </label>
        <input
          type="text"
          value={data.targetRole}
          onChange={(e) => updateFields({ targetRole: e.target.value })}
          placeholder="e.g. Senior Fullstack Engineer"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: errors.targetRole ? '1px solid #ef4444' : '1px solid #cbd5e1',
            boxSizing: 'border-box',
          }}
        />
        {errors.targetRole && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.targetRole}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
          Target Seniority *
        </label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {SENIORITY_OPTIONS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => updateFields({ seniority: lvl })}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                backgroundColor: data.seniority === lvl ? '#3b82f6' : '#f8fafc',
                color: data.seniority === lvl ? '#ffffff' : '#334155',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
