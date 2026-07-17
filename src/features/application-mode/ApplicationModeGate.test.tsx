import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApplicationModeStore } from './application-mode-store';
import { ApplicationModeGate } from './ApplicationModeGate';

function renderModeGate(path: string) {
  const modeStore = createApplicationModeStore(window.sessionStorage);
  const router = createMemoryRouter(
    [
      { path: '/app/select-mode', element: <h1>Select mode</h1> },
      { path: '/app/speed', element: <h1>Speed dashboard</h1> },
      {
        path: '*',
        element: (
          <ApplicationModeGate modeStore={modeStore}>
            <h1>Protected application page</h1>
          </ApplicationModeGate>
        ),
      },
    ],
    { initialEntries: [path] },
  );

  render(<RouterProvider router={router} />);
  return { modeStore, router };
}

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('ApplicationModeGate', () => {
  it('redirects a missing mode to mode selection and preserves the requested path', async () => {
    const { router } = renderModeGate('/app/reports?period=weekly');

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/select-mode'));
    expect(router.state.location.state).toEqual({ returnTo: '/app/reports?period=weekly' });
  });

  it('clears malformed storage and redirects safely to mode selection', async () => {
    window.sessionStorage.setItem('transport-management.application-mode', '{bad-json');
    const { router } = renderModeGate('/app/trips');

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/select-mode'));
    expect(window.sessionStorage.getItem('transport-management.application-mode')).toBeNull();
  });

  it('restores a valid mode after a refresh-style store recreation', () => {
    createApplicationModeStore(window.sessionStorage).setMode('tracking');

    renderModeGate('/app/reports');

    expect(screen.getByRole('heading', { name: 'Protected application page' })).toBeInTheDocument();
  });

  it('redirects speed mode away from tracking-only routes', async () => {
    createApplicationModeStore(window.sessionStorage).setMode('speed');
    const { router } = renderModeGate('/app/groups/example-group');

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/speed'));
    expect(screen.getByRole('heading', { name: 'Speed dashboard' })).toBeInTheDocument();
  });

  it('allows shared routes in speed mode', () => {
    createApplicationModeStore(window.sessionStorage).setMode('speed');

    renderModeGate('/app/notifications');

    expect(screen.getByRole('heading', { name: 'Protected application page' })).toBeInTheDocument();
  });
});
