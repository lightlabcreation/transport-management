import type { ApplicationMode, ApplicationModeStore } from './application-mode.types';

const STORAGE_KEY = 'transport-management.application-mode';

function isApplicationMode(value: unknown): value is ApplicationMode {
  return value === 'tracking' || value === 'speed';
}

export function createApplicationModeStore(storage: Storage): ApplicationModeStore {
  function clearMode() {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Browser storage may be unavailable. Failing closed leaves no selected mode.
    }
  }

  return {
    getMode() {
      try {
        const storedValue = storage.getItem(STORAGE_KEY);
        if (!storedValue) return null;

        const parsed: unknown = JSON.parse(storedValue);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          clearMode();
          return null;
        }

        const mode = (parsed as { mode?: unknown }).mode;
        if (!isApplicationMode(mode)) {
          clearMode();
          return null;
        }

        return mode;
      } catch {
        clearMode();
        return null;
      }
    },
    setMode(mode) {
      if (!isApplicationMode(mode)) {
        clearMode();
        return;
      }

      try {
        storage.setItem(STORAGE_KEY, JSON.stringify({ mode }));
      } catch {
        clearMode();
      }
    },
    clearMode,
  };
}

export const browserApplicationModeStore = createApplicationModeStore(window.sessionStorage);
