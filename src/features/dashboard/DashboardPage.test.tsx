import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import type { AuthSessionStore } from '@/features/auth';

import { DashboardPage } from './DashboardPage';

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

function renderDashboard(sessionStore: AuthSessionStore) {
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      { path: '/app/dashboard', element: <DashboardPage sessionStore={sessionStore} /> },
    ],
    { initialEntries: ['/app/dashboard'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('DashboardPage', () => {
  it('renders the complete operations dashboard inside the application shell', () => {
    renderDashboard(createSessionStore());

    expect(screen.getByRole('heading', { name: 'Good afternoon' })).toBeInTheDocument();
    expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Active Vehicles')).toBeInTheDocument();
    expect(screen.getByText('Total Drivers')).toBeInTheDocument();
    expect(screen.getByText("Today's Trips")).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Operations overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recent trips' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recent driver activity' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'System status' })).toBeInTheDocument();
  });

  it('announces unavailable quick actions without navigating', async () => {
    const user = userEvent.setup();
    const router = renderDashboard(createSessionStore());

    await user.click(screen.getByRole('button', { name: /Add Vehicle/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Add Vehicle is coming soon.');
    expect(router.state.location.pathname).toBe('/app/dashboard');
  });

  it('redirects unauthenticated direct access to Login', async () => {
    const router = renderDashboard(createSessionStore(false));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(screen.getByRole('heading', { name: 'Sign in boundary' })).toBeInTheDocument();
  });

  it('clears the session and returns to Login through the existing logout behavior', async () => {
    const user = userEvent.setup();
    const clearSession = vi.fn();
    const sessionStore = { ...createSessionStore(), clearSession };
    const router = renderDashboard(sessionStore);

    const logoutButtons = screen.getAllByRole('button', { name: /log out/i });
    await user.click(logoutButtons[0]!);

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(clearSession).toHaveBeenCalledOnce();
  });
});
