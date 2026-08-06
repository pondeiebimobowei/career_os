import { useState } from 'react';
import { OnboardingPage } from './features/profile/routes/OnboardingPage';
import { ProfilePage } from './features/profile/routes/ProfilePage';

function App() {
  const [view, setView] = useState<'onboarding' | 'profile'>('profile');

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Global Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-black text-indigo-600 tracking-tight">CareerOS</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold">Alpha</span>
        </div>
        <nav className="flex space-x-2">
          <button
            type="button"
            onClick={() => setView('profile')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              view === 'profile'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            View Profile
          </button>
          <button
            type="button"
            onClick={() => setView('onboarding')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              view === 'onboarding'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Edit / Onboarding
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {view === 'onboarding' ? (
          <OnboardingPage onComplete={() => setView('profile')} />
        ) : (
          <ProfilePage onNavigateToOnboarding={() => setView('onboarding')} />
        )}
      </main>
    </div>
  );
}

export default App;
