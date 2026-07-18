import { useNavigate } from 'react-router';

import type { ApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';
import { SettingsPage } from '@/features/settings';

interface SettingsRouteProps {
  sessionStore: AuthSessionStore;
  modeStore: ApplicationModeStore;
}

export function SettingsRoute({ sessionStore, modeStore }: SettingsRouteProps) {
  const navigate = useNavigate();
  const mode = modeStore.getMode() ?? 'speed';

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  return <SettingsPage mode={mode} onLogout={handleLogout} />;
}
