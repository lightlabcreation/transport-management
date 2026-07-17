import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createApplicationModeStore } from './application-mode-store';
import { ApplicationModeSelectionPage } from './ApplicationModeSelectionPage';

function renderSelectionPage(returnTo?: string) {
  const modeStore = createApplicationModeStore(window.sessionStorage);
  const onLogout = vi.fn();
  const router = createMemoryRouter(
    [
      {
        path: '/app/select-mode',
        element: <ApplicationModeSelectionPage modeStore={modeStore} onLogout={onLogout} />,
      },
      { path: '*', element: <h1>Requested application page</h1> },
    ],
    {
      initialEntries: [
        {
          pathname: '/app/select-mode',
          state: returnTo ? { returnTo } : null,
        },
      ],
    },
  );

  render(<RouterProvider router={router} />);
  return { modeStore, onLogout, router };
}

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('ApplicationModeSelectionPage', () => {
  it('persists tracking mode and continues to a safe requested route', async () => {
    const user = userEvent.setup();
    const { modeStore, router } = renderSelectionPage('/app/reports?period=weekly');

    await user.click(screen.getByRole('radio', { name: /tracking and groups/i }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/reports'));
    expect(router.state.location.search).toBe('?period=weekly');
    expect(modeStore.getMode()).toBe('tracking');
  });

  it('sends speed mode to its dashboard when the requested route is tracking-only', async () => {
    const user = userEvent.setup();
    const { modeStore, router } = renderSelectionPage('/app/groups?status=active');

    await user.click(screen.getByRole('radio', { name: /speed only/i }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/speed'));
    expect(modeStore.getMode()).toBe('speed');
  });

  it('requires a mode before continuing', () => {
    renderSelectionPage();

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  it('runs logout cleanup before returning to Login', async () => {
    const user = userEvent.setup();
    const { onLogout, router } = renderSelectionPage();

    await user.click(screen.getByRole('button', { name: 'Log out' }));

    expect(onLogout).toHaveBeenCalledOnce();
    expect(router.state.location.pathname).toBe('/auth/login');
  });
});
