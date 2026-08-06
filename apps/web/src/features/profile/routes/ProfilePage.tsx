import React from 'react';
import { useProfileView } from '../hooks/useProfileView';
import { ProfileViewCard } from '../components/ProfileViewCard';

interface ProfilePageProps {
  userId?: string;
  onNavigateToOnboarding?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  userId = 'demo-user-id',
  onNavigateToOnboarding,
}) => {
  const { profile, loading, error } = useProfileView(userId);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <ProfileViewCard
        profile={profile}
        loading={loading}
        error={error}
        onStartOnboarding={onNavigateToOnboarding}
      />
    </div>
  );
};

export default ProfilePage;
