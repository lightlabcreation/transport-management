export interface AuthSession {
  kind: 'authenticated';
  authenticatedAt: string;
  expiresAt: string;
}

export type SessionFactory = () => AuthSession;

const MOCK_SESSION_DURATION_MS = 30 * 60 * 1000;

export function createMockAuthSession(now: Date = new Date()): AuthSession {
  return {
    kind: 'authenticated',
    authenticatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + MOCK_SESSION_DURATION_MS).toISOString(),
  };
}
