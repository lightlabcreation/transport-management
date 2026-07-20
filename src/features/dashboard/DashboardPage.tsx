import { Navigate, useLocation, useNavigate } from 'react-router';

import type { DemoAccessProfile } from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import { browserApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';
import {
  AdminPage,
  GuestPage,
  MemberPage,
  ModeratorPage,
  OwnerPage,
  SuperAdminPage,
} from '@/features/roles';
import { ApplicationShell } from '@/features/shell';

interface DashboardPageProps {
  sessionStore: AuthSessionStore;
  accessProfile: DemoAccessProfile | null;
}

export function DashboardPage({ sessionStore, accessProfile }: DashboardPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const applicationMode = browserApplicationModeStore.getMode();
  const applicationNavigation = applicationMode
    ? getApplicationNavigation(applicationMode, accessProfile)
    : [];

  if (!sessionStore.getSession()) return <Navigate to="/auth/login" replace />;
  if (!accessProfile) return <Navigate to="/app/access-preview" replace />;

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  const rolePage = getRolePage(accessProfile);

  return (
    <ApplicationShell
      navigationItems={applicationNavigation}
      currentPath={location.pathname}
      userSummary={{
        name: 'Demo Operator',
        mobile: '+•• ••••••3210',
        roleLabel: accessProfile.name,
      }}
      onLogout={handleLogout}
    >
      {rolePage}
    </ApplicationShell>
  );
}

function getRolePage(accessProfile: DemoAccessProfile) {
  switch (accessProfile.id) {
    case 'group-owner':
      return <OwnerPage />;
    case 'delegated-group-administrator':
      return <SuperAdminPage />;
    case 'group-admin':
      return <AdminPage />;
    case 'moderator':
      return <ModeratorPage />;
    case 'member':
      return <MemberPage />;
    case 'group-guest':
      return <GuestPage />;
    default:
      return <OwnerPage />;
  }
}
