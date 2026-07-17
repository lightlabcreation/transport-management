import type { AuthSession } from './authSession';

const STORAGE_KEY = 'transport-management.auth-session';

export interface AuthSessionStore {
  getSession(): AuthSession | null;
  setSession(session: AuthSession): void;
  clearSession(): void;
  isSessionValid(session: AuthSession): boolean;
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;

  const session = value as Partial<AuthSession>;
  return (
    session.kind === 'authenticated' &&
    isIsoDate(session.authenticatedAt) &&
    isIsoDate(session.expiresAt)
  );
}

export function createAuthSessionStore(
  storage: Storage,
  now: () => Date = () => new Date(),
): AuthSessionStore {
  function clearSession() {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Browser storage can be unavailable. Failing closed keeps protected content inaccessible.
    }
  }

  function isSessionValid(session: AuthSession) {
    return Date.parse(session.expiresAt) > now().getTime();
  }

  return {
    getSession() {
      try {
        const storedValue = storage.getItem(STORAGE_KEY);
        if (!storedValue) return null;

        const parsed: unknown = JSON.parse(storedValue);
        if (!isAuthSession(parsed) || !isSessionValid(parsed)) {
          clearSession();
          return null;
        }

        return parsed;
      } catch {
        clearSession();
        return null;
      }
    },
    setSession(session) {
      if (!isSessionValid(session)) {
        clearSession();
        return;
      }

      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch {
        clearSession();
      }
    },
    clearSession,
    isSessionValid,
  };
}

export const browserAuthSessionStore = createAuthSessionStore(window.sessionStorage);
