import { useState, useEffect } from 'react';
import type { OnboardingData } from '../types';
import { fetchUserProfile } from '../api/profileClient';

export function useProfileView(userId: string = 'demo-user-id') {
  const [profile, setProfile] = useState<OnboardingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserProfile(userId);
        if (isMounted) {
          setProfile(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Failed to load profile';
          setError(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { profile, loading, error };
}
