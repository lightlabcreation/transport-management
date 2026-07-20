import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import {
  demoAccessProfiles,
  type DemoAccessProfile,
  type DemoAccessProfileId,
} from '@/features/access-control';
import type { AuthSessionStore } from '@/features/auth';

import { getDashboardCapabilities } from './dashboard.access';
import { DashboardPage } from './DashboardPage';
import { DashboardRoute } from './DashboardRoute';

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

function profile(profileId: DemoAccessProfileId) {
  return demoAccessProfiles.find((item) => item.id === profileId)!;
}

function renderDashboard(
  accessProfile: DemoAccessProfile | null = profile('group-owner'),
  sessionStore: AuthSessionStore = createSessionStore(),
) {
  window.sessionStorage.setItem(
    'transport-management.application-mode',
    JSON.stringify({ mode: 'tracking' }),
  );
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      { path: '/app/access-preview', element: <h1>Access Preview boundary</h1> },
      {
        path: '/app/dashboard',
        element: <DashboardPage sessionStore={sessionStore} accessProfile={accessProfile} />,
      },
    ],
    { initialEntries: ['/app/dashboard'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('DashboardPage role-aware presentation', () => {
  it('renders the OwnerPage for group-owner', () => {
    renderDashboard(profile('group-owner'));
    expect(screen.getByRole('heading', { name: /Platform Administration & Fleet Oversight/i })).toBeInTheDocument();
  });

  it('renders the SuperAdminPage for delegated-group-administrator', () => {
    renderDashboard(profile('delegated-group-administrator'));
    expect(screen.getByRole('heading', { name: /System Infrastructure & Cluster Oversight/i })).toBeInTheDocument();
  });

  it('renders the AdminPage for group-admin', () => {
    renderDashboard(profile('group-admin'));
    expect(screen.getAllByText(/Group Member Directory/i).length).toBeGreaterThan(0);
  });

  it('renders the ModeratorPage for moderator', () => {
    renderDashboard(profile('moderator'));
    expect(screen.getByRole('heading', { name: /Live Traffic Monitoring & Speed Violation Control/i })).toBeInTheDocument();
  });

  it('renders the MemberPage for member', () => {
    renderDashboard(profile('member'));
    expect(screen.getByRole('heading', { name: /Group Member Telemetry & Privacy Portal/i })).toBeInTheDocument();
  });

  it('renders the GuestPage for group-guest', () => {
    renderDashboard(profile('group-guest'));
    expect(screen.getByRole('heading', { name: /Group Guest Preview & Join Status/i })).toBeInTheDocument();
  });

  it('maps representative frontend capabilities without implying authorization', () => {
    expect(getDashboardCapabilities('group-owner')).toMatchObject({
      canViewTrips: true,
      canManageMembers: true,
      canApproveRequests: true,
      isReadOnly: false,
    });
    expect(getDashboardCapabilities('group-guest')).toMatchObject({
      canViewTrips: false,
      canManageMembers: false,
      canApproveRequests: false,
      isReadOnly: true,
    });
  });

  it('redirects a missing profile safely to Access Preview', async () => {
    const router = renderDashboard(null);

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/access-preview'));
    expect(screen.getByRole('heading', { name: 'Access Preview boundary' })).toBeInTheDocument();
  });
});

describe('DashboardPage existing behavior', () => {
  it('reads the current profile when the Dashboard route renders', () => {
    const getProfile = vi.fn(() => profile('moderator'));
    const accessStore = {
      getProfile,
      setProfile: vi.fn(),
      clearProfile: vi.fn(),
    };
    const router = createMemoryRouter(
      [
        {
          path: '/app/dashboard',
          element: <DashboardRoute sessionStore={createSessionStore()} accessStore={accessStore} />,
        },
      ],
      { initialEntries: ['/app/dashboard'] },
    );
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('heading', { name: /Live Traffic Monitoring & Speed Violation Control/i })).toBeInTheDocument();
    expect(getProfile).toHaveBeenCalled();
  });

  it('redirects unauthenticated direct access to Login', async () => {
    const router = renderDashboard(profile('group-owner'), createSessionStore(false));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(screen.getByRole('heading', { name: 'Sign in boundary' })).toBeInTheDocument();
  });

  it('clears the session and returns to Login through the existing logout behavior', async () => {
    const user = userEvent.setup();
    const clearSession = vi.fn();
    const sessionStore = { ...createSessionStore(), clearSession };
    const router = renderDashboard(profile('group-owner'), sessionStore);

    const logoutButtons = screen.getAllByRole('button', { name: /log out/i });
    await user.click(logoutButtons[0]!);

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(clearSession).toHaveBeenCalledOnce();
  });
});
