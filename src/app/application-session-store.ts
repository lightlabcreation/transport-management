import type { DemoAccessStore, PendingDemoAccessStore } from '@/features/access-control';
import type { ApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';

interface ApplicationSessionStores {
  authSessionStore: AuthSessionStore;
  accessStore: DemoAccessStore;
  pendingAccessStore: PendingDemoAccessStore;
  modeStore: ApplicationModeStore;
}

export function createApplicationSessionStore({
  authSessionStore,
  accessStore,
  pendingAccessStore,
  modeStore,
}: ApplicationSessionStores): AuthSessionStore {
  return {
    getSession: () => authSessionStore.getSession(),
    setSession: (session) => authSessionStore.setSession(session),
    clearSession: () => {
      authSessionStore.clearSession();
      accessStore.clearProfile();
      pendingAccessStore.clearProfile();
      modeStore.clearMode();
    },
    isSessionValid: (session) => authSessionStore.isSessionValid(session),
  };
}
