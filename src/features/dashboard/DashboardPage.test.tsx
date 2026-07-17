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

import { getDashboardCapabilities, getDashboardPresentation } from './dashboard.access';
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
  it.each(demoAccessProfiles)('renders the $name profile presentation', (accessProfile) => {
    const presentation = getDashboardPresentation(accessProfile);
    renderDashboard(accessProfile);

    expect(screen.getByRole('heading', { name: presentation.heading })).toBeInTheDocument();
    expect(screen.getByText(accessProfile.name, { selector: 'p' })).toBeInTheDocument();
    expect(
      screen.getByText(
        'This is a frontend access preview. Production permissions require backend authorization.',
      ),
    ).toBeInTheDocument();
    for (const metric of presentation.metrics) {
      expect(screen.getAllByText(metric.label).length).toBeGreaterThan(0);
    }
  });

  it('shows the complete Group Owner management presentation', () => {
    renderDashboard(profile('group-owner'));

    expect(screen.getByText('Total Members')).toBeInTheDocument();
    expect(screen.getByText('Active Groups')).toBeInTheDocument();
    expect(screen.getByText('Trips Today')).toBeInTheDocument();
    expect(screen.getByText('Tracking Online')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Manage Members' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Review Requests' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Operations overview' })).toBeInTheDocument();
  });

  it('shows personal information for Member without management controls', () => {
    renderDashboard(profile('member'));

    expect(screen.getByText('My Activity')).toBeInTheDocument();
    expect(screen.getByText('My Trips')).toBeInTheDocument();
    expect(screen.getByText('My Tracking Status')).toBeInTheDocument();
    expect(screen.getByText('My Alerts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View My Trips' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage Members' })).not.toBeInTheDocument();
  });

  it('shows Group Guest as read-only with restricted actions and trip information', () => {
    renderDashboard(profile('group-guest'));

    expect(screen.getByRole('heading', { name: 'Restricted access' })).toBeInTheDocument();
    expect(screen.getByText(/This guest preview is read-only/i)).toBeInTheDocument();
    expect(screen.getByText(/No management actions are available/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Manage Members' })).not.toBeInTheDocument();
    expect(screen.getByText(/Trip operations are not included/i)).toBeInTheDocument();
  });

  it('maps representative frontend capabilities without implying authorization', () => {
    expect(getDashboardCapabilities('group-owner')).toMatchObject({
      canViewTrips: true,
      canManageMembers: true,
      canApproveRequests: true,
      isReadOnly: false,
    });
    expect(getDashboardCapabilities('moderator')).toMatchObject({
      canViewTrips: false,
      canApproveRequests: true,
      canReviewAlerts: true,
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

    expect(screen.getByRole('heading', { name: 'Moderator dashboard' })).toBeInTheDocument();
    expect(getProfile).toHaveBeenCalled();
  });

  it('keeps the complete structural dashboard sections for an operational profile', () => {
    renderDashboard(profile('group-admin'));

    expect(screen.getByRole('heading', { name: 'Administration focus' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Operations overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recent active trips' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Member operations' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Access explanation' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'System status' })).toBeInTheDocument();
  });

  it('announces unavailable quick actions without navigating', async () => {
    const user = userEvent.setup();
    const router = renderDashboard(profile('group-owner'));

    await user.click(screen.getByRole('button', { name: 'Manage Members' }));

    expect(screen.getByRole('status')).toHaveTextContent('Manage Members is coming soon.');
    expect(router.state.location.pathname).toBe('/app/dashboard');
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
