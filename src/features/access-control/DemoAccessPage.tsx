import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import type { AuthSessionStore } from '@/features/auth';

import { demoAccessProfiles } from './demo-access.profiles';
import type { DemoAccessProfile, DemoAccessStore } from './demo-access.types';
import type { PendingDemoAccessStore } from './demo-access-pending-store';

interface DemoAccessPageProps {
  sessionStore: AuthSessionStore;
  accessStore: DemoAccessStore;
}

interface DemoAccessResetProps {
  accessStore: DemoAccessStore;
  pendingDemoAccessStore?: PendingDemoAccessStore;
  children: ReactNode;
}

export function DemoAccessReset({
  accessStore,
  pendingDemoAccessStore,
  children,
}: DemoAccessResetProps) {
  useEffect(() => {
    accessStore.clearProfile();
    pendingDemoAccessStore?.clearProfile();
  }, [accessStore, pendingDemoAccessStore]);

  return children;
}

export function DemoAccessPage({ sessionStore, accessStore }: DemoAccessPageProps) {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<DemoAccessProfile | null>(() =>
    accessStore.getProfile(),
  );

  if (!sessionStore.getSession()) {
    accessStore.clearProfile();
    return <Navigate to="/auth/login" replace />;
  }

  function handleSelect(profile: DemoAccessProfile) {
    setSelectedProfile(profile);
    accessStore.setProfile(profile);
  }

  function handleContinue() {
    if (!selectedProfile) return;
    void navigate('/app/dashboard');
  }

  function handleLogout() {
    accessStore.clearProfile();
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-gutter py-10 text-foreground sm:px-page lg:px-section lg:py-16">
      <div className="mx-auto max-w-content">
        <header className="max-w-3xl">
          <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
            Demo access
          </p>
          <h1 className="mt-3 text-heading-lg font-semibold tracking-tight">
            Choose a group profile
          </h1>
          <p className="mt-3 text-body-lg text-muted-foreground">
            Select the group-level perspective you want to use for this frontend demonstration.
          </p>
        </header>

        <p className="mt-6 rounded-lg border border-warning/40 bg-warning/10 p-4 text-body-sm">
          This selector previews frontend access behavior. Production authorization requires backend
          enforcement.
        </p>

        <section aria-labelledby="profiles-heading" className="mt-8">
          <h2 id="profiles-heading" className="sr-only">
            Available demo profiles
          </h2>
          <div
            role="group"
            aria-label="Demo access profiles"
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {demoAccessProfiles.map((profile) => {
              const isSelected = selectedProfile?.id === profile.id;
              return (
                <article
                  key={profile.id}
                  className={`flex min-h-52 flex-col rounded-xl border p-5 shadow-sm transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border bg-surface'
                  }`}
                >
                  <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
                    Group profile
                  </p>
                  <h3 className="mt-3 text-heading-sm font-semibold">{profile.name}</h3>
                  <p className="mt-2 flex-1 text-body-sm text-muted-foreground">
                    {profile.description}
                  </p>
                  <Button
                    className="mt-5"
                    variant={isSelected ? 'primary' : 'outline'}
                    aria-label={`Select ${profile.name} profile`}
                    aria-pressed={isSelected}
                    onClick={() => handleSelect(profile)}
                  >
                    {isSelected ? 'Selected' : 'Select profile'}
                  </Button>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
          <Button onClick={handleContinue} disabled={!selectedProfile}>
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </main>
  );
}
