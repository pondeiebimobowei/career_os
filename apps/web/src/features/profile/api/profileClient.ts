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

  return response.json();
}
