import type { ReactNode } from 'react';

import { useLocation, useNavigate } from 'react-router';

import type { DemoAccessStore } from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import type { ApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';
import { ApplicationShell } from '@/features/shell';

interface ApplicationPageFrameProps {
  sessionStore: AuthSessionStore;
  accessStore: DemoAccessStore;
  modeStore: ApplicationModeStore;
  children: ReactNode;
}

export function ApplicationPageFrame({
  sessionStore,
  accessStore,
  modeStore,
  children,
}: ApplicationPageFrameProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = modeStore.getMode();
  const profile = accessStore.getProfile();
  const navigationItems = mode ? getApplicationNavigation(mode, profile) : [];

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  return (
    <ApplicationShell
      navigationItems={navigationItems}
      currentPath={location.pathname}
      userSummary={{
        name: 'Demo Operator',
        mobile: 'Demo account',
        roleLabel: profile?.name,
      }}
      onLogout={handleLogout}
    >
      {children}
    </ApplicationShell>
  );
}
