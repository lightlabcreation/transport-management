import { beforeEach, describe, expect, it } from 'vitest';

import {
  createDemoAccessStore,
  createPendingDemoAccessStore,
  demoAccessProfiles,
} from '@/features/access-control';
import { createApplicationModeStore } from '@/features/application-mode';
import { createAuthSessionStore, type AuthSession } from '@/features/auth';

import { createApplicationSessionStore } from './application-session-store';

const validSession: AuthSession = {
  kind: 'authenticated',
  authenticatedAt: '2026-07-18T06:00:00.000Z',
  expiresAt: '2030-01-01T00:00:00.000Z',
};

function createStores() {
  const authSessionStore = createAuthSessionStore(
    window.sessionStorage,
    () => new Date('2026-07-18T06:30:00.000Z'),
  );
  const accessStore = createDemoAccessStore(window.sessionStorage);
  const pendingAccessStore = createPendingDemoAccessStore(window.sessionStorage);
  const modeStore = createApplicationModeStore(window.sessionStorage);
  const applicationSessionStore = createApplicationSessionStore({
    authSessionStore,
    accessStore,
    pendingAccessStore,
    modeStore,
  });

  return {
    accessStore,
    applicationSessionStore,
    authSessionStore,
    modeStore,
    pendingAccessStore,
  };
}

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('application session store', () => {
  it('preserves authentication persistence and validation behavior', () => {
    const { applicationSessionStore } = createStores();

    applicationSessionStore.setSession(validSession);

    expect(applicationSessionStore.getSession()).toEqual(validSession);
    expect(applicationSessionStore.isSessionValid(validSession)).toBe(true);
  });

  it('clears authentication, active access, pending access, and application mode together', () => {
    const {
      accessStore,
      applicationSessionStore,
      authSessionStore,
      modeStore,
      pendingAccessStore,
    } = createStores();
    authSessionStore.setSession(validSession);
    accessStore.setProfile(demoAccessProfiles[0]!);
    pendingAccessStore.setProfileId('member');
    modeStore.setMode('tracking');

    applicationSessionStore.clearSession();

    expect(authSessionStore.getSession()).toBeNull();
    expect(accessStore.getProfile()).toBeNull();
    expect(pendingAccessStore.getProfileId()).toBeNull();
    expect(modeStore.getMode()).toBeNull();
  });
});
