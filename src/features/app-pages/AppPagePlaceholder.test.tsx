import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createDemoAccessStore,
  demoAccessProfiles,
  ProtectedApplicationRoute,
} from '@/features/access-control';
import type { AuthSessionStore } from '@/features/auth';

import { AppPagePlaceholder } from './AppPagePlaceholder';
import { appPageDefinitions } from './app-page-definitions';

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

function renderProtectedPlaceholder(path: string, title: string, hasSession: boolean) {
  const accessStore = createDemoAccessStore(window.sessionStorage);
  accessStore.setProfile(demoAccessProfiles[0]!);
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Login boundary</h1> },
      {
        path,
        element: (
          <ProtectedApplicationRoute
            sessionStore={createSessionStore(hasSession)}
            accessStore={accessStore}
          >
            <AppPagePlaceholder title={title} />
          </ProtectedApplicationRoute>
        ),
      },
    ],
    { initialEntries: [path] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('application page placeholders', () => {
  it.each(appPageDefinitions)('renders the $title placeholder at $path', ({ path, title }) => {
    renderProtectedPlaceholder(path, title, true);

    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(
      screen.getByText('Feature implementation will be added in a later batch.'),
    ).toBeInTheDocument();
  });

  it('redirects unauthenticated placeholder access to Login', async () => {
    const router = renderProtectedPlaceholder('/app/reports', 'Reports', false);

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(screen.getByRole('heading', { name: 'Login boundary' })).toBeInTheDocument();
  });
});
