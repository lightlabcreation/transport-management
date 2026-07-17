import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { createMockAuthSession } from './authSession';
import { createAuthSessionStore, type AuthSessionStore } from './authSessionStore';
import { ProtectedPlaceholderPage } from './ProtectedPlaceholderPage';

const now = new Date('2026-07-17T12:00:00.000Z');

function renderProtected(sessionStore: AuthSessionStore) {
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Sign in</h1> },
      {
        path: '/auth/authenticated',
        element: <ProtectedPlaceholderPage sessionStore={sessionStore} />,
      },
    ],
    { initialEntries: ['/auth/authenticated'] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

describe('authenticated session boundary', () => {
  beforeEach(() => window.sessionStorage.clear());

  it('opens the protected placeholder with a valid stored session', () => {
    const sessionStore = createAuthSessionStore(window.sessionStorage, () => now);
    sessionStore.setSession(createMockAuthSession(now));

    renderProtected(sessionStore);

    expect(screen.getByRole('heading', { name: 'Authenticated' })).toBeInTheDocument();
  });

  it('restores a valid session through a new store after a simulated refresh', () => {
    createAuthSessionStore(window.sessionStorage, () => now).setSession(createMockAuthSession(now));

    const restoredStore = createAuthSessionStore(window.sessionStorage, () => now);
    expect(restoredStore.getSession()).toEqual(createMockAuthSession(now));

    renderProtected(restoredStore);
    expect(screen.getByRole('heading', { name: 'Authenticated' })).toBeInTheDocument();
  });

  it('redirects direct protected access without a session to Login', async () => {
    renderProtected(createAuthSessionStore(window.sessionStorage, () => now));

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('rejects and clears an expired session', async () => {
    const storageKey = 'transport-management.auth-session';
    window.sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        kind: 'authenticated',
        authenticatedAt: '2026-07-17T10:00:00.000Z',
        expiresAt: '2026-07-17T11:00:00.000Z',
      }),
    );

    renderProtected(createAuthSessionStore(window.sessionStorage, () => now));

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
  });

  it('fails safely and clears malformed browser storage', async () => {
    const storageKey = 'transport-management.auth-session';
    window.sessionStorage.setItem(storageKey, '{invalid');

    renderProtected(createAuthSessionStore(window.sessionStorage, () => now));

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
  });

  it('stores no OTP or challenge metadata in the session projection', () => {
    const sessionStore = createAuthSessionStore(window.sessionStorage, () => now);
    sessionStore.setSession(createMockAuthSession(now));

    const storedValue = window.sessionStorage.getItem('transport-management.auth-session');
    expect(storedValue).not.toBeNull();
    expect(JSON.parse(storedValue ?? '')).toEqual({
      kind: 'authenticated',
      authenticatedAt: '2026-07-17T12:00:00.000Z',
      expiresAt: '2026-07-17T12:30:00.000Z',
    });
  });

  it('logs out, redirects to Login, and prevents reopening protected content', async () => {
    const sessionStore = createAuthSessionStore(window.sessionStorage, () => now);
    sessionStore.setSession(createMockAuthSession(now));
    const router = renderProtected(sessionStore);

    await userEvent.setup().click(screen.getByRole('button', { name: 'Log out' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(sessionStore.getSession()).toBeNull();

    await router.navigate('/auth/authenticated');
    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Authenticated' })).not.toBeInTheDocument();
  });
});
