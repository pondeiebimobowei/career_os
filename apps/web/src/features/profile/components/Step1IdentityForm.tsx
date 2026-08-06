import React from 'react';
import type { OnboardingData } from '../types';

interface Step1Props {
  data: OnboardingData;
  errors: Record<string, string>;
  updateFields: (fields: Partial<OnboardingData>) => void;
}

export const Step1IdentityForm: React.FC<Step1Props> = ({ data, errors, updateFields }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Let's start with your details</h2>
      <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
        This helps personalize your job tracking dashboard and application materials.
      </p>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
          Full Name *
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => updateFields({ fullName: e.target.value })}
          placeholder="e.g. Alex Chen"
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: errors.fullName ? '1px solid #ef4444' : '1px solid #cbd5e1',
            boxSizing: 'border-box',
          }}
        />
        {errors.fullName && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.fullName}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
          Timezone *
        </label>
        <input
          type="text"
          value={data.timezone}
          onChange={(e) => updateFields({ timezone: e.target.value })}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: errors.timezone ? '1px solid #ef4444' : '1px solid #cbd5e1',
            boxSizing: 'border-box',
          }}
        />
        {errors.timezone && <span style={{ color: '#ef4444', fontSize: '12px' }}>{errors.timezone}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
          Professional Bio (Optional)
        </label>
        <textarea
          rows={3}
          value={data.bio || ''}
          onChange={(e) => updateFields({ bio: e.target.value })}
          placeholder="Brief summary of your expertise and goals..."
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
};
