import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import type { AuthSessionStore } from '@/features/auth';

import { LiveMapPage } from './LiveMapPage';
import type { LiveMapViewState } from './live-map.types';

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

function renderLiveMap({
  hasSession = true,
  viewState = 'ready',
}: { hasSession?: boolean; viewState?: LiveMapViewState } = {}) {
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      {
        path: '/app/live-map',
        element: (
          <LiveMapPage sessionStore={createSessionStore(hasSession)} viewState={viewState} />
        ),
      },
    ],
    { initialEntries: ['/app/live-map'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('LiveMapPage', () => {
  it('renders the accessible map preview and member list for an authenticated session', () => {
    renderLiveMap();

    expect(screen.getAllByRole('heading', { level: 1, name: 'Live Map' })).toHaveLength(2);
    expect(screen.getByRole('region', { name: 'Live member map preview' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Tracked members' })).toBeInTheDocument();
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
    expect(screen.getByText('Meera Singh')).toBeInTheDocument();
  });

  it('redirects unauthenticated direct access to Login', async () => {
    const router = renderLiveMap({ hasSession: false });

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
    expect(screen.getByRole('heading', { name: 'Sign in boundary' })).toBeInTheDocument();
  });

  it('provides accessible marker names', () => {
    renderLiveMap();

    expect(
      screen.getByRole('button', { name: /Select Aarav Sharma, online/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Select Rohan Verma, offline/i }),
    ).toBeInTheDocument();
  });

  it('filters members by name search', async () => {
    const user = userEvent.setup();
    renderLiveMap();

    await user.type(screen.getByRole('searchbox', { name: 'Search members' }), 'Meera');

    const list = screen.getByRole('list', { name: 'Tracked members' });
    expect(within(list).getByText('Meera Singh')).toBeInTheDocument();
    expect(within(list).queryByText('Aarav Sharma')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Select Aarav Sharma, online/i }),
    ).not.toBeInTheDocument();
  });

  it('filters members by status and clears filters', async () => {
    const user = userEvent.setup();
    renderLiveMap();

    const filters = screen.getByRole('group', { name: 'Filter members by status' });
    await user.click(within(filters).getByRole('button', { name: /offline/i }));
    const list = screen.getByRole('list', { name: 'Tracked members' });
    expect(within(list).getByText('Rohan Verma')).toBeInTheDocument();
    expect(within(list).queryByText('Aarav Sharma')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(within(list).getByText('Aarav Sharma')).toBeInTheDocument();
  });

  it('shows an empty result and restores members from its clear action', async () => {
    const user = userEvent.setup();
    renderLiveMap();

    await user.type(screen.getByRole('searchbox', { name: 'Search members' }), 'Nobody here');
    expect(screen.getByText('No members match your filters.')).toBeInTheDocument();

    const emptyState = screen.getByText('No members match your filters.').parentElement!;
    await user.click(within(emptyState).getByRole('button', { name: 'Clear filters' }));
    expect(screen.getByText('Aarav Sharma')).toBeInTheDocument();
  });

  it('updates member details when a map marker is selected', async () => {
    const user = userEvent.setup();
    renderLiveMap();

    await user.click(screen.getByRole('button', { name: /Select Meera Singh, stale/i }));

    const details = screen.getByRole('region', { name: 'Member details' });
    expect(within(details).getByRole('heading', { name: 'Meera Singh' })).toBeInTheDocument();
    expect(within(details).getByText('41%')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Meera Singh selected.');
  });

  it('updates the same member details from a list selection', async () => {
    const user = userEvent.setup();
    renderLiveMap();

    const list = screen.getByRole('list', { name: 'Tracked members' });
    await user.click(within(list).getByRole('button', { name: /Kavya Patel/i }));

    const details = screen.getByRole('region', { name: 'Member details' });
    expect(within(details).getByRole('heading', { name: 'Kavya Patel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select Kavya Patel, online/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('announces presentation-only member and map actions', async () => {
    const user = userEvent.setup();
    renderLiveMap();

    await user.click(screen.getByRole('button', { name: /Select Aarav Sharma, online/i }));
    await user.click(screen.getByRole('button', { name: 'Navigate' }));
    expect(screen.getByRole('status')).toHaveTextContent('Navigate is preview only. Coming soon.');

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByRole('status')).toHaveTextContent('Zoom in is preview only. Coming soon.');
  });

  it('renders a deterministic loading state without map positions', () => {
    renderLiveMap({ viewState: 'loading' });

    expect(screen.getByText(/Loading simulated tracking data/)).toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'Live member map preview' }),
    ).not.toBeInTheDocument();
  });

  it('fails safely when the map provider is unavailable', () => {
    renderLiveMap({ viewState: 'provider-unavailable' });

    expect(screen.getByRole('alert')).toHaveTextContent('Tracking cannot currently be shown');
    expect(screen.getByRole('alert')).toHaveTextContent(
      'No member position should be treated as live',
    );
    expect(
      screen.queryByRole('region', { name: 'Live member map preview' }),
    ).not.toBeInTheDocument();
  });
});
