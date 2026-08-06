import type { OnboardingData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function submitOnboardingProfile(userId: string, data: OnboardingData) {
  const response = await fetch(`${API_BASE}/api/v1/profile/${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to save profile: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchUserProfile(userId: string): Promise<OnboardingData | null> {
  const response = await fetch(`${API_BASE}/api/v1/profile/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  const json = await response.json();
  const raw = json.data || json;
  if (!raw) return null;

  const profileObj = raw.profile || raw;

  return {
    fullName: raw.fullName || profileObj.fullName || '',
    timezone: raw.timezone || profileObj.timezone || 'UTC',
    bio: profileObj.bio || '',
    targetRole: profileObj.targetRole || '',
    seniority: profileObj.seniority || 'SENIOR',
    skills: profileObj.skills || [],
    preferredLocations: profileObj.preferredLocations || [],
    remotePreference: profileObj.remotePreference || 'REMOTE_ONLY',
    openToRelocation: profileObj.openToRelocation ?? false,
    minSalary: profileObj.minSalary,
    maxSalary: profileObj.maxSalary,
    currency: profileObj.currency || 'USD',
    searchStatus: profileObj.searchStatus || 'ACTIVELY_LOOKING',
  };
}
