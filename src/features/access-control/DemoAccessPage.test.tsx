import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';

import type { AuthSessionStore } from '@/features/auth';

import { createDemoAccessStore } from './demo-access-store';
import { createPendingDemoAccessStore } from './demo-access-pending-store';
import { demoAccessProfiles } from './demo-access.profiles';
import { DemoAccessPage, DemoAccessReset } from './DemoAccessPage';
import { ProtectedApplicationRoute } from './ProtectedApplicationRoute';

const validSession = {
  kind: 'authenticated' as const,
  authenticatedAt: '2026-07-17T12:00:00.000Z',
  expiresAt: '2030-01-01T00:00:00.000Z',
};

function createSessionStore(hasSession = true): AuthSessionStore {
  return {
    getSession: vi.fn(() => (hasSession ? validSession : null)),
    setSession: vi.fn(),
    clearSession: vi.fn(),
    isSessionValid: vi.fn(() => hasSession),
  };
}

function renderAccessPage(sessionStore: AuthSessionStore = createSessionStore()) {
  const accessStore = createDemoAccessStore(window.sessionStorage);
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      {
        path: '/app/access-preview',
        element: <DemoAccessPage sessionStore={sessionStore} accessStore={accessStore} />,
      },
      { path: '/app/dashboard', element: <h1>Dashboard boundary</h1> },
    ],
    { initialEntries: ['/app/access-preview'] },
  );
  render(<RouterProvider router={router} />);
  return { accessStore, router };
}

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('DemoAccessPage', () => {
  it('renders exactly the six approved group demo profiles', () => {
    renderAccessPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Choose a group profile' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Select .+ profile$/ })).toHaveLength(6);
    for (const profile of demoAccessProfiles) {
      expect(screen.getByRole('heading', { name: profile.name })).toBeInTheDocument();
    }
    expect(screen.queryByText('Platform Owner')).not.toBeInTheDocument();
  });

  it('selects and persists a profile while enabling Continue', async () => {
    const user = userEvent.setup();
    const { accessStore } = renderAccessPage();
    const continueButton = screen.getByRole('button', { name: 'Continue to Dashboard' });

    expect(continueButton).toBeDisabled();
    const ownerButton = screen.getByRole('button', { name: 'Select Group Owner profile' });
    await user.click(ownerButton);

    expect(ownerButton).toHaveAttribute('aria-pressed', 'true');
    expect(continueButton).toBeEnabled();
    expect(accessStore.getProfile()?.id).toBe('group-owner');
  });

  it('continues to the Dashboard after selection', async () => {
    const user = userEvent.setup();
    const { router } = renderAccessPage();

    await user.click(screen.getByRole('button', { name: 'Select Member profile' }));
    await user.click(screen.getByRole('button', { name: 'Continue to Dashboard' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/dashboard'));
  });

  it('restores a previously selected profile after a refresh-style remount', () => {
    const accessStore = createDemoAccessStore(window.sessionStorage);
    accessStore.setProfile(demoAccessProfiles[3]!);

    renderAccessPage();

    expect(screen.getByRole('button', { name: 'Select Moderator profile' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Continue to Dashboard' })).toBeEnabled();
  });

  it('clears malformed stored data and starts without a selection', () => {
    window.sessionStorage.setItem('transport-management.demo-access-profile', '{not-json');

    const { accessStore } = renderAccessPage();

    expect(accessStore.getProfile()).toBeNull();
    expect(window.sessionStorage.getItem('transport-management.demo-access-profile')).toBeNull();
    expect(screen.getByRole('button', { name: 'Continue to Dashboard' })).toBeDisabled();
  });

  it('clears both demo access and authentication state on logout', async () => {
    const user = userEvent.setup();
    const clearSession = vi.fn();
    const sessionStore = { ...createSessionStore(), clearSession };
    const { accessStore, router } = renderAccessPage(sessionStore);

    await user.click(screen.getByRole('button', { name: 'Select Group Admin profile' }));
    expect(accessStore.getProfile()).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'Log out' }));

    expect(accessStore.getProfile()).toBeNull();
    expect(clearSession).toHaveBeenCalledOnce();
    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
  });

  it('redirects an unauthenticated visitor to Login', async () => {
    const clearSession = vi.fn();
    const sessionStore = { ...createSessionStore(false), clearSession };
    const { router } = renderAccessPage(sessionStore);

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(clearSession).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: 'Sign in boundary' })).toBeInTheDocument();
  });
});

describe('ProtectedApplicationRoute', () => {
  it('redirects an authenticated user without a profile to Access Preview', async () => {
    const accessStore = createDemoAccessStore(window.sessionStorage);
    const router = createMemoryRouter(
      [
        {
          path: '/app/dashboard',
          element: (
            <ProtectedApplicationRoute
              sessionStore={createSessionStore()}
              accessStore={accessStore}
            >
              <h1>Protected dashboard</h1>
            </ProtectedApplicationRoute>
          ),
        },
        { path: '/app/access-preview', element: <h1>Access Preview boundary</h1> },
      ],
      { initialEntries: ['/app/dashboard'] },
    );
    render(<RouterProvider router={router} />);

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/access-preview'));
    expect(screen.getByRole('heading', { name: 'Access Preview boundary' })).toBeInTheDocument();
  });

  it('keeps an authenticated user with a restored profile on the requested route', () => {
    const accessStore = createDemoAccessStore(window.sessionStorage);
    accessStore.setProfile(demoAccessProfiles[0]!);
    const router = createMemoryRouter(
      [
        {
          path: '/app/dashboard',
          element: (
            <ProtectedApplicationRoute
              sessionStore={createSessionStore()}
              accessStore={accessStore}
            >
              <h1>Protected dashboard</h1>
            </ProtectedApplicationRoute>
          ),
        },
      ],
      { initialEntries: ['/app/dashboard'] },
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: 'Protected dashboard' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/app/dashboard');
  });
});

describe('DemoAccessReset', () => {
  it('clears a selected demo profile when the Login boundary mounts', async () => {
    const accessStore = createDemoAccessStore(window.sessionStorage);
    const pendingDemoAccessStore = createPendingDemoAccessStore(window.sessionStorage);
    accessStore.setProfile(demoAccessProfiles[0]!);
    pendingDemoAccessStore.setProfileId('member');

    render(
      <DemoAccessReset accessStore={accessStore} pendingDemoAccessStore={pendingDemoAccessStore}>
        <h1>Login</h1>
      </DemoAccessReset>,
    );

    await waitFor(() => expect(accessStore.getProfile()).toBeNull());
    expect(pendingDemoAccessStore.getProfileId()).toBeNull();
  });
});
