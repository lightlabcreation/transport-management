import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import type { AuthSessionStore } from '@/features/auth';

import { createDemoAccessStore } from './demo-access-store';
import { demoAccessProfiles } from './demo-access.profiles';
import { ProtectedApplicationRoute } from './ProtectedApplicationRoute';

const validSession = {
  kind: 'authenticated' as const,
  authenticatedAt: '2026-07-17T12:00:00.000Z',
  expiresAt: '2030-01-01T00:00:00.000Z',
};

function createSessionStore(hasSession: boolean): AuthSessionStore {
  return {
    getSession: vi.fn(() => (hasSession ? validSession : null)),
    setSession: vi.fn(),
    clearSession: vi.fn(),
    isSessionValid: vi.fn(() => hasSession),
  };
}

function renderProtectedRoute(path: string, hasSession: boolean, hasProfile: boolean) {
  const accessStore = createDemoAccessStore(window.sessionStorage);
  if (hasProfile) accessStore.setProfile(demoAccessProfiles[0]!);

  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Login boundary</h1> },
      { path: '/app/access-preview', element: <h1>Access Preview boundary</h1> },
      {
        path,
        element: (
          <ProtectedApplicationRoute
            sessionStore={createSessionStore(hasSession)}
            accessStore={accessStore}
          >
            <h1>Protected content</h1>
          </ProtectedApplicationRoute>
        ),
      },
    ],
    { initialEntries: [path] },
  );
  render(<RouterProvider router={router} />);
  return { accessStore, router };
}

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('ProtectedApplicationRoute routing rules', () => {
  it('redirects a missing authentication session to Login and clears demo access', async () => {
    const { accessStore, router } = renderProtectedRoute('/app/dashboard', false, true);

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(accessStore.getProfile()).toBeNull();
  });

  it('redirects an authenticated session without a demo profile to Access Preview', async () => {
    const { router } = renderProtectedRoute('/app/dashboard', true, false);

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/access-preview'));
  });

  it.each(['/app/dashboard', '/app/live-map', '/app/groups'])(
    'allows authenticated demo access to %s without requiring route state',
    (path) => {
      const { router } = renderProtectedRoute(path, true, true);

      expect(router.state.location.pathname).toBe(path);
      expect(router.state.location.state).toBeNull();
      expect(screen.getByRole('heading', { name: 'Protected content' })).toBeInTheDocument();
    },
  );

  it('fails safely when stored demo access data is invalid', async () => {
    window.sessionStorage.setItem(
      'transport-management.demo-access-profile',
      JSON.stringify({ profileId: 'unknown-profile' }),
    );
    const { accessStore, router } = renderProtectedRoute('/app/live-map', true, false);

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/access-preview'));
    expect(accessStore.getProfile()).toBeNull();
  });

  it.each(['/auth/login', '/auth/register', '/auth/verify', '/legal/terms', '/onboarding/welcome'])(
    'leaves the public route %s accessible without authentication',
    (path) => {
      const router = createMemoryRouter([{ path, element: <h1>Public content</h1> }], {
        initialEntries: [path],
      });
      render(<RouterProvider router={router} />);

      expect(router.state.location.pathname).toBe(path);
      expect(screen.getByRole('heading', { name: 'Public content' })).toBeInTheDocument();
    },
  );
});
