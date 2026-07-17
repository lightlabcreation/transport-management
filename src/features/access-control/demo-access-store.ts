import { findDemoAccessProfile } from './demo-access.profiles';
import type { DemoAccessProfile, DemoAccessStore } from './demo-access.types';

const STORAGE_KEY = 'transport-management.demo-access-profile';

export function createDemoAccessStore(storage: Storage): DemoAccessStore {
  function clearProfile() {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Browser storage may be unavailable. Failing closed leaves no demo access profile.
    }
  }

  return {
    getProfile() {
      try {
        const storedValue = storage.getItem(STORAGE_KEY);
        if (!storedValue) return null;

        const parsed: unknown = JSON.parse(storedValue);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          clearProfile();
          return null;
        }

        const profile = findDemoAccessProfile((parsed as { profileId?: unknown }).profileId);
        if (!profile) clearProfile();
        return profile;
      } catch {
        clearProfile();
        return null;
      }
    },
    setProfile(profile: DemoAccessProfile) {
      const approvedProfile = findDemoAccessProfile(profile.id);
      if (!approvedProfile) {
        clearProfile();
        return;
      }

      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ profileId: approvedProfile.id }));
      } catch {
        clearProfile();
      }
    },
    clearProfile,
  };
}

export const browserDemoAccessStore = createDemoAccessStore(window.sessionStorage);
