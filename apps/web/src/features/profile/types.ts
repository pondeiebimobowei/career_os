export type SeniorityLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
export type RemotePreference = 'REMOTE_ONLY' | 'HYBRID' | 'ONSITE' | 'OPEN';
export type SearchStatus = 'ACTIVELY_LOOKING' | 'OPEN_TO_OFFERS' | 'CASUALLY_BROWSING' | 'NOT_LOOKING';

export interface OnboardingData {
  fullName: string;
  timezone: string;
  bio?: string;
  targetRole: string;
  seniority: SeniorityLevel;
  skills: string[];
  preferredLocations: string[];
  remotePreference: RemotePreference;
  openToRelocation: boolean;
  minSalary?: number;
  maxSalary?: number;
  currency: string;
  searchStatus: SearchStatus;
}
