import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createDemoAccessStore, demoAccessProfiles } from '@/features/access-control';
import { createApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';

import { ApplicationPageFrame } from './ApplicationPageFrame';

const clearSession = vi.fn();

const sessionStore: AuthSessionStore = {
  getSession: vi.fn(),
  setSession: vi.fn(),
  clearSession,
  isSessionValid: vi.fn(),
};

beforeEach(() => {
  window.sessionStorage.clear();
  vi.clearAllMocks();
});

function renderFrame(profileId: 'group-owner' | 'moderator', mode: 'tracking' | 'speed') {
  const accessStore = createDemoAccessStore(window.sessionStorage);
  const modeStore = createApplicationModeStore(window.sessionStorage);
  accessStore.setProfile(demoAccessProfiles.find((profile) => profile.id === profileId)!);
  modeStore.setMode(mode);

  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Login</h1> },
      {
        path: '/app/speed',
        element: (
          <ApplicationPageFrame
            sessionStore={sessionStore}
            accessStore={accessStore}
            modeStore={modeStore}
          >
            <p>Speed dashboard content</p>
          </ApplicationPageFrame>
        ),
      },
    ],
    { initialEntries: ['/app/speed'] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

describe('ApplicationPageFrame', () => {
  it('uses mode and profile aware navigation in the existing shell', () => {
    renderFrame('moderator', 'tracking');
    const navigation = screen.getByRole('navigation', { name: /desktop navigation/i });

    expect(within(navigation).getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: 'Live Map' })).not.toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: 'Trips' })).not.toBeInTheDocument();
    expect(screen.getByText('Speed dashboard content')).toBeInTheDocument();
  });

  it('uses speed-only navigation in speed mode', () => {
    renderFrame('group-owner', 'speed');
    const navigation = screen.getByRole('navigation', { name: /desktop navigation/i });

    expect(within(navigation).getByRole('link', { name: 'Speed Dashboard' })).toBeInTheDocument();
    expect(within(navigation).queryByRole('link', { name: 'Groups' })).not.toBeInTheDocument();
  });

  it('delegates logout to the centralized session boundary and returns to Login', async () => {
    const user = userEvent.setup();
    const router = renderFrame('group-owner', 'tracking');

    await user.click(screen.getAllByRole('button', { name: 'Log out' })[0]!);

    expect(clearSession).toHaveBeenCalledOnce();
    expect(router.state.location.pathname).toBe('/auth/login');
  });
});
