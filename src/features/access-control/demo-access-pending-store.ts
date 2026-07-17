import { findDemoAccessProfile } from './demo-access.profiles';
import type { DemoAccessProfileId } from './demo-access.types';

const STORAGE_KEY = 'transport-management.demo-access-pending-profile';

export interface PendingDemoAccessStore {
  getProfileId(): DemoAccessProfileId | null;
  setProfileId(profileId: DemoAccessProfileId): void;
  clearProfile(): void;
}

export function createPendingDemoAccessStore(storage: Storage): PendingDemoAccessStore {
  function clearProfile() {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Browser storage may be unavailable. Failing closed keeps the profile inactive.
    }
  }

  return {
    getProfileId() {
      try {
        const storedValue = storage.getItem(STORAGE_KEY);
        if (!storedValue) return null;

        const parsed: unknown = JSON.parse(storedValue);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          clearProfile();
          return null;
        }

        const profileId = (parsed as { profileId?: unknown }).profileId;
        if (typeof profileId !== 'string' || !findDemoAccessProfile(profileId)) {
          clearProfile();
          return null;
        }

        return profileId as DemoAccessProfileId;
      } catch {
        clearProfile();
        return null;
      }
    },
    setProfileId(profileId) {
      if (!findDemoAccessProfile(profileId)) {
        clearProfile();
        return;
      }

      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ profileId }));
      } catch {
        clearProfile();
      }
    },
    clearProfile,
  };
}

export const browserPendingDemoAccessStore = createPendingDemoAccessStore(window.sessionStorage);
