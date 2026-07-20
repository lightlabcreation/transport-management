import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createDemoAccessStore,
  createPendingDemoAccessStore,
  DemoAccessReset,
  demoAccessProfiles,
  ProtectedApplicationRoute,
} from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import {
  ApplicationModeGate,
  ApplicationModeReset,
  createApplicationModeStore,
  type ApplicationMode,
} from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';

import { AppPagePlaceholder } from './AppPagePlaceholder';
import { appPageDefinitions } from './app-page-definitions';

const validSession = {
  kind: 'authenticated' as const,
  authenticatedAt: '2026-07-17T12:00:00.000Z',
  expiresAt: '2030-01-01T00:00:00.000Z',
};

function createSessionStore(
  hasSession: boolean,
  clearSession: () => void = vi.fn(),
): AuthSessionStore {
  return {
    getSession: vi.fn(() => (hasSession ? validSession : null)),
    setSession: vi.fn(),
    clearSession,
    isSessionValid: vi.fn(() => hasSession),
  };
}

function renderProtectedPlaceholder(
  path: string,
  title: string,
  hasSession: boolean,
  mode: ApplicationMode | null = 'tracking',
) {
  const clearSession = vi.fn();
  const sessionStore = createSessionStore(hasSession, clearSession);
  const accessStore = createDemoAccessStore(window.sessionStorage);
  const pendingAccessStore = createPendingDemoAccessStore(window.sessionStorage);
  const modeStore = createApplicationModeStore(window.sessionStorage);
  accessStore.setProfile(demoAccessProfiles[0]!);
  if (mode) modeStore.setMode(mode);

  const router = createMemoryRouter(
    [
      {
        path: '/auth/login',
        element: (
          <ApplicationModeReset
            modeStore={modeStore}
            shouldReset={() => accessStore.getProfile() !== null}
          >
            <DemoAccessReset accessStore={accessStore} pendingDemoAccessStore={pendingAccessStore}>
              <h1>Login boundary</h1>
            </DemoAccessReset>
          </ApplicationModeReset>
        ),
      },
      { path: '/app/select-mode', element: <h1>Select mode boundary</h1> },
      {
        path,
        element: (
          <ProtectedApplicationRoute sessionStore={sessionStore} accessStore={accessStore}>
            <ApplicationModeGate modeStore={modeStore}>
              <AppPagePlaceholder
                title={title}
                sessionStore={sessionStore}
                accessStore={accessStore}
                modeStore={modeStore}
              />
            </ApplicationModeGate>
          </ProtectedApplicationRoute>
        ),
      },
    ],
    { initialEntries: [path] },
  );

  render(<RouterProvider router={router} />);
  return { accessStore, clearSession, modeStore, pendingAccessStore, router, sessionStore };
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

  it('uses the centralized tracking navigation consistently inside the shell', () => {
    renderProtectedPlaceholder('/app/reports', 'Reports', true);
    const desktopNavigation = screen.getByRole('navigation', { name: /desktop navigation/i });

    for (const item of getApplicationNavigation('tracking')) {
      expect(
        within(desktopNavigation).getByRole('link', { name: item.ariaLabel || item.label }),
      ).toHaveAttribute('href', item.href);
    }
    expect(within(desktopNavigation).getByRole('link', { name: 'Reports' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('uses speed navigation without tracking-only destinations', () => {
    renderProtectedPlaceholder('/app/reports', 'Reports', true, 'speed');
    const desktopNavigation = screen.getByRole('navigation', { name: /desktop navigation/i });

    expect(within(desktopNavigation).getByRole('link', { name: 'Speed Dashboard' })).toBeVisible();
    expect(
      within(desktopNavigation).queryByRole('link', { name: 'Live Map' }),
    ).not.toBeInTheDocument();
    expect(
      within(desktopNavigation).queryByRole('link', { name: 'Groups' }),
    ).not.toBeInTheDocument();
  });

  it('redirects unauthenticated placeholder access to Login', async () => {
    const { router } = renderProtectedPlaceholder('/app/reports', 'Reports', false);

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(screen.getByRole('heading', { name: 'Login boundary' })).toBeInTheDocument();
  });

  it('redirects an authenticated user without a mode to mode selection', async () => {
    const { router } = renderProtectedPlaceholder('/app/reports', 'Reports', true, null);

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/select-mode'));
    expect(screen.getByRole('heading', { name: 'Select mode boundary' })).toBeInTheDocument();
  });

  it('clears session, demo profiles, and application mode during logout', async () => {
    const user = userEvent.setup();
    const { accessStore, clearSession, modeStore, pendingAccessStore, router } =
      renderProtectedPlaceholder('/app/reports', 'Reports', true);
    pendingAccessStore.setProfileId('group-owner');

    await user.click(screen.getAllByRole('button', { name: 'Log out' })[0]!);

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    await waitFor(() => {
      expect(clearSession).toHaveBeenCalledOnce();
      expect(accessStore.getProfile()).toBeNull();
      expect(pendingAccessStore.getProfileId()).toBeNull();
      expect(modeStore.getMode()).toBeNull();
    });
  });
});
