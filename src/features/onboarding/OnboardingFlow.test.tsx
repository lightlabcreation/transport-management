import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApplicationModeStore } from '@/features/application-mode';
import type { ApplicationModeStore } from '@/features/application-mode';

import { LanguageSelectionPage } from './LanguageSelectionPage';
import { ModeSelectionPage } from './ModeSelectionPage';
import { PermissionIntroductionPage } from './PermissionIntroductionPage';
import { WelcomePage } from './WelcomePage';

function createOnboardingRouter(
  initialEntry: string | { pathname: string; state: unknown },
  modeStore: ApplicationModeStore = createApplicationModeStore(window.sessionStorage),
) {
  return createMemoryRouter(
    [
      { path: '/onboarding/language', element: <LanguageSelectionPage /> },
      { path: '/onboarding/welcome', element: <WelcomePage /> },
      { path: '/onboarding/mode', element: <ModeSelectionPage modeStore={modeStore} /> },
      { path: '/onboarding/permissions', element: <PermissionIntroductionPage /> },
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      { path: '/auth/register', element: <h1>Registration boundary</h1> },
    ],
    { initialEntries: [initialEntry] },
  );
}

beforeEach(() => {
  window.sessionStorage.clear();
});

function renderRouter(router: ReturnType<typeof createOnboardingRouter>) {
  render(<RouterProvider router={router} />);
  return router;
}

describe('onboarding flow', () => {
  it('completes the language, welcome, tracking mode, and permission-introduction journey', async () => {
    const user = userEvent.setup();
    const modeStore = createApplicationModeStore(window.sessionStorage);
    const router = renderRouter(createOnboardingRouter('/onboarding/language', modeStore));

    expect(screen.getByLabelText('Language')).toHaveValue('en');
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(
      await screen.findByRole('heading', {
        name: /transport management built around every journey/i,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    expect(
      await screen.findByRole('heading', { name: /select an application mode/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('radio', { name: /tracking and groups/i }));
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(await screen.findByRole('heading', { name: 'Before you continue' })).toBeInTheDocument();
    expect(modeStore.getMode()).toBe('tracking');
    expect(
      screen.getByText(/subject to your device consent and group policy/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/register'));
  });

  it('requires an application mode and focuses the mode group', async () => {
    const user = userEvent.setup();
    renderRouter(
      createOnboardingRouter({ pathname: '/onboarding/mode', state: { language: 'en' } }),
    );

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const group = screen.getByRole('group', { name: 'Application mode' });
    expect(group).toHaveFocus();
    expect(screen.getByText('Select an application mode to continue.')).toBeInTheDocument();
  });

  it('shows Speed Only permission copy without group claims and enters Login', async () => {
    const user = userEvent.setup();
    const router = renderRouter(
      createOnboardingRouter({
        pathname: '/onboarding/permissions',
        state: { language: 'en', mode: 'speed' },
      }),
    );

    expect(screen.getByText(/speed and navigation features/i)).toBeInTheDocument();
    expect(screen.queryByText(/group policy/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/login'));
  });

  it.each(['/onboarding/welcome', '/onboarding/mode', '/onboarding/permissions'])(
    'redirects incomplete direct entry at %s to language selection',
    async (path) => {
      const router = renderRouter(createOnboardingRouter(path));

      await waitFor(() => expect(router.state.location.pathname).toBe('/onboarding/language'));
      expect(screen.getByRole('heading', { name: 'Choose your language' })).toBeInTheDocument();
    },
  );
});
