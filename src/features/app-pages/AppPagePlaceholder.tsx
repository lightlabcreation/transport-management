import { useLocation, useNavigate } from 'react-router';

import type { DemoAccessStore } from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import type { ApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';
import { ApplicationShell } from '@/features/shell';

interface AppPagePlaceholderProps {
  title: string;
  sessionStore: AuthSessionStore;
  accessStore: DemoAccessStore;
  modeStore: ApplicationModeStore;
}

export function AppPagePlaceholder({
  title,
  sessionStore,
  accessStore,
  modeStore,
}: AppPagePlaceholderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = modeStore.getMode();
  const accessProfile = accessStore.getProfile();
  const applicationNavigation = mode ? getApplicationNavigation(mode) : [];

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  return (
    <ApplicationShell
      navigationItems={applicationNavigation}
      currentPath={location.pathname}
      userSummary={{
        name: 'Demo Operator',
        mobile: 'Demo account',
        roleLabel: accessProfile?.name,
      }}
      onLogout={handleLogout}
    >
      <section className="rounded-xl border border-border bg-surface p-page shadow-sm sm:p-section">
        <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
          Planned application module
        </p>
        <h2 className="mt-3 text-heading-lg font-semibold tracking-tight">{title}</h2>
        <p className="mt-3 max-w-2xl text-body text-muted-foreground">
          Feature implementation will be added in a later batch.
        </p>
      </section>
    </ApplicationShell>
  );
}
