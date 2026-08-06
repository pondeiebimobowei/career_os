import React from 'react';
import type { OnboardingData } from '../types';

interface ProfileViewCardProps {
  profile: OnboardingData | null;
  loading: boolean;
  error: string | null;
  onStartOnboarding?: () => void;
}

export const ProfileViewCard: React.FC<ProfileViewCardProps> = ({
  profile,
  loading,
  error,
  onStartOnboarding,
}) => {
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto my-10 p-8 rounded-xl bg-white shadow-xl border border-slate-100 font-sans animate-pulse">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-slate-200 rounded w-1/3" />
            <div className="h-4 bg-slate-200 rounded w-1/4" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto my-10 p-8 rounded-xl bg-white shadow-xl border border-red-100 font-sans text-center">
        <div className="w-12 h-12 mx-auto mb-4 text-red-500 bg-red-50 rounded-full flex items-center justify-center font-bold text-xl">
          !
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Unable to Load Profile</h3>
        <p className="text-sm text-slate-600 mb-6">{error}</p>
        {onStartOnboarding && (
          <button
            type="button"
            onClick={onStartOnboarding}
            className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Complete Onboarding Profile
          </button>
        )}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto my-10 p-8 rounded-xl bg-white shadow-xl border border-slate-100 font-sans text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-2xl">
          👤
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Profile Found</h2>
        <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
          You haven't configured your career profile yet. Complete onboarding to personalize your job search preferences.
        </p>
        {onStartOnboarding && (
          <button
            type="button"
            onClick={onStartOnboarding}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md transition-colors cursor-pointer"
          >
            Start Career Profile Onboarding
          </button>
        )}
      </div>
    );
  }

  const formatSearchStatus = (status: string) => {
    switch (status) {
      case 'ACTIVELY_LOOKING':
        return { label: 'Actively Looking', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'OPEN_TO_OFFERS':
        return { label: 'Open to Offers', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'CASUALLY_BROWSING':
        return { label: 'Casually Browsing', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Not Looking', bg: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const statusBadge = formatSearchStatus(profile.searchStatus);

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 rounded-xl bg-white shadow-xl border border-slate-100 font-sans">
      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900">{profile.fullName}</h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusBadge.bg}`}
            >
              {statusBadge.label}
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Timezone: {profile.timezone}</p>
        </div>

        {onStartOnboarding && (
          <button
            type="button"
            onClick={onStartOnboarding}
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
          >
            Update Profile
          </button>
        )}
      </div>

      {/* Bio Section */}
      {profile.bio && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">About</h3>
          <p className="text-slate-700 text-sm leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Grid of Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role & Seniority */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Target Role</h3>
          <p className="text-slate-900 font-bold text-base">{profile.targetRole || 'Not specified'}</p>
          <p className="text-slate-600 text-xs mt-1">Seniority Level: <span className="font-semibold text-slate-800">{profile.seniority}</span></p>
        </div>

        {/* Remote & Location Preferences */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location & Work Style</h3>
          <p className="text-slate-900 font-bold text-base">
            {profile.preferredLocations && profile.preferredLocations.length > 0
              ? profile.preferredLocations.join(', ')
              : 'Remote / Flexible'}
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Preference: <span className="font-semibold text-slate-800">{profile.remotePreference.replace('_', ' ')}</span>
            {profile.openToRelocation && <span className="ml-2 text-indigo-600 font-medium">(Relocation Open)</span>}
          </p>
        </div>

        {/* Compensation Expectations */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Salary Expectation</h3>
          <p className="text-slate-900 font-bold text-base">
            {profile.minSalary && profile.maxSalary
              ? `${profile.currency} ${profile.minSalary.toLocaleString()} - ${profile.maxSalary.toLocaleString()}`
              : profile.minSalary
              ? `${profile.currency} ${profile.minSalary.toLocaleString()}+`
              : 'Negotiable'}
          </p>
        </div>

        {/* Core Skills */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Core Skills</h3>
          {profile.skills && profile.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-xs italic">No skills listed</p>
          )}
        </div>
      </div>
    </div>
  );
};
