import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileViewCard } from '../components/ProfileViewCard';
import type { OnboardingData } from '../types';

const mockProfile: OnboardingData = {
  fullName: 'Alex Morgan',
  timezone: 'America/New_York',
  bio: 'Experienced Staff Engineer building scalable systems.',
  targetRole: 'Staff Software Engineer',
  seniority: 'SENIOR',
  skills: ['TypeScript', 'React', 'NestJS', 'PostgreSQL'],
  preferredLocations: ['New York, NY', 'Remote'],
  remotePreference: 'HYBRID',
  openToRelocation: true,
  minSalary: 180000,
  maxSalary: 220000,
  currency: 'USD',
  searchStatus: 'ACTIVELY_LOOKING',
};

describe('ProfileViewCard', () => {
  it('renders loading skeleton when loading is true', () => {
    const { container } = render(
      <ProfileViewCard profile={null} loading={true} error={null} />
    );
    expect(container.querySelector('.animate-pulse')).not.toBeNull();
  });

  it('renders error message when error occurs', () => {
    render(
      <ProfileViewCard
        profile={null}
        loading={false}
        error="Network connection error"
      />
    );
    expect(screen.getByText('Unable to Load Profile')).toBeDefined();
    expect(screen.getByText('Network connection error')).toBeDefined();
  });

  it('renders empty state when profile is null', () => {
    const onStart = vi.fn();
    render(
      <ProfileViewCard
        profile={null}
        loading={false}
        error={null}
        onStartOnboarding={onStart}
      />
    );
    expect(screen.getByText('No Profile Found')).toBeDefined();
    const btn = screen.getByText('Start Career Profile Onboarding');
    fireEvent.click(btn);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('renders complete profile details when profile is provided', () => {
    render(
      <ProfileViewCard profile={mockProfile} loading={false} error={null} />
    );
    expect(screen.getByText('Alex Morgan')).toBeDefined();
    expect(screen.getByText('Actively Looking')).toBeDefined();
    expect(screen.getByText('Staff Software Engineer')).toBeDefined();
    expect(screen.getByText('USD 180,000 - 220,000')).toBeDefined();
    expect(screen.getByText('TypeScript')).toBeDefined();
    expect(screen.getByText('NestJS')).toBeDefined();
  });
});
