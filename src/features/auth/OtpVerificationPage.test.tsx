import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createDemoAccessStore, createPendingDemoAccessStore } from '@/features/access-control';
import type { DemoAccessStore, PendingDemoAccessStore } from '@/features/access-control';

import { AuthServiceError, type AuthService } from './authService';
import { createMockAuthSession } from './authSession';
import { createAuthSessionStore, type AuthSessionStore } from './authSessionStore';
import { OtpVerificationPage } from './OtpVerificationPage';

const challengeState = {
  source: 'login' as const,
  challengeId: 'challenge-1',
  maskedMobile: '+•• ••••••3210',
  expiresAt: '2030-01-01T00:05:00.000Z',
};

beforeEach(() => {
  window.sessionStorage.clear();
});

function createAuthService(verifyOtp: AuthService['verifyOtp']): AuthService {
  return {
    requestOtp: vi.fn<AuthService['requestOtp']>(),
    register: vi.fn<AuthService['register']>(),
    verifyOtp,
  };
}

function createSessionStore(): AuthSessionStore {
  return {
    getSession: vi.fn(),
    setSession: vi.fn(),
    clearSession: vi.fn(),
    isSessionValid: vi.fn(() => true),
  };
}

function renderVerification(
  authService: AuthService,
  withState = true,
  sessionStore = createSessionStore(),
  accessStore?: DemoAccessStore,
  pendingDemoAccessStore?: PendingDemoAccessStore,
) {
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      { path: '/auth/register', element: <h1>Registration boundary</h1> },
      { path: '/app/access-preview', element: <h1>Access Preview boundary</h1> },
      {
        path: '/auth/verify',
        element: (
          <OtpVerificationPage
            authService={authService}
            sessionFactory={() => createMockAuthSession(new Date('2026-07-17T12:00:00.000Z'))}
            sessionStore={sessionStore}
            {...(accessStore ? { accessStore } : {})}
            {...(pendingDemoAccessStore ? { pendingDemoAccessStore } : {})}
          />
        ),
      },
      { path: '/auth/authenticated', element: <h1>Authenticated boundary</h1> },
    ],
    {
      initialEntries: [
        withState ? { pathname: '/auth/verify', state: challengeState } : '/auth/verify',
      ],
    },
  );
  render(<RouterProvider router={router} />);
  return { router, sessionStore };
}

describe('OtpVerificationPage', () => {
  it('redirects direct entry without a challenge to Login', async () => {
    renderVerification(createAuthService(vi.fn()), false);
    expect(await screen.findByRole('heading', { name: 'Sign in boundary' })).toBeInTheDocument();
  });

  it('validates a six-digit code locally', async () => {
    const user = userEvent.setup();
    const verifyOtp = vi.fn<AuthService['verifyOtp']>();
    renderVerification(createAuthService(verifyOtp));

    await user.type(screen.getByLabelText('Verification code'), '12ab');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    expect(screen.getByText('Enter the 6-digit verification code.')).toBeInTheDocument();
    expect(screen.getByLabelText('Verification code')).toHaveFocus();
    expect(verifyOtp).not.toHaveBeenCalled();
  });

  it('returns a registration challenge to Registration when changing the number', async () => {
    const user = userEvent.setup();
    const authService = createAuthService(vi.fn());
    const router = createMemoryRouter(
      [
        { path: '/auth/login', element: <h1>Sign in boundary</h1> },
        { path: '/auth/register', element: <h1>Registration boundary</h1> },
        {
          path: '/auth/verify',
          element: (
            <OtpVerificationPage
              authService={authService}
              sessionFactory={() => createMockAuthSession()}
              sessionStore={createSessionStore()}
            />
          ),
        },
      ],
      {
        initialEntries: [
          { pathname: '/auth/verify', state: { ...challengeState, source: 'registration' } },
        ],
      },
    );
    render(<RouterProvider router={router} />);

    await user.click(screen.getByRole('link', { name: 'Change mobile number' }));

    expect(router.state.location.pathname).toBe('/auth/register');
  });

  it('verifies the challenge and reaches the neutral authenticated boundary', async () => {
    const user = userEvent.setup();
    window.sessionStorage.clear();
    const sessionStore = createAuthSessionStore(
      window.sessionStorage,
      () => new Date('2026-07-17T12:00:00.000Z'),
    );
    const verifyOtp = vi.fn<AuthService['verifyOtp']>().mockResolvedValue({
      status: 'authenticated',
    });
    const { router } = renderVerification(createAuthService(verifyOtp), true, sessionStore);

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/authenticated'));
    expect(verifyOtp).toHaveBeenCalledWith({ challengeId: 'challenge-1', code: '123456' });
    expect(sessionStore.getSession()).toEqual({
      kind: 'authenticated',
      authenticatedAt: '2026-07-17T12:00:00.000Z',
      expiresAt: '2026-07-17T12:30:00.000Z',
    });
  });

  it.each([
    ['invalid_otp', 'That verification code is incorrect. Try again.'],
    ['expired_challenge', 'This verification code has expired. Request a new code.'],
    ['rate_limited', 'Too many attempts. Please wait before trying again.'],
    ['network', 'Unable to connect. Check your connection and try again.'],
  ] as const)('shows and focuses a safe %s failure', async (code, message) => {
    const user = userEvent.setup();
    const verifyOtp = vi
      .fn<AuthService['verifyOtp']>()
      .mockRejectedValue(new AuthServiceError(code));
    renderVerification(createAuthService(verifyOtp));

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(message);
    expect(alert).toHaveFocus();
  });

  it('activates the selected demo profile only after successful OTP verification', async () => {
    const user = userEvent.setup();
    const verifyOtp = vi.fn<AuthService['verifyOtp']>().mockResolvedValue({
      status: 'authenticated',
    });
    const accessStore = createDemoAccessStore(window.sessionStorage);
    const pendingDemoAccessStore = createPendingDemoAccessStore(window.sessionStorage);
    pendingDemoAccessStore.setProfileId('group-owner');
    const sessionStore = createAuthSessionStore(
      window.sessionStorage,
      () => new Date('2026-07-17T12:00:00.000Z'),
    );
    const { router } = renderVerification(
      createAuthService(verifyOtp),
      true,
      sessionStore,
      accessStore,
      pendingDemoAccessStore,
    );

    expect(accessStore.getProfile()).toBeNull();
    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/authenticated'));
    expect(accessStore.getProfile()?.id).toBe('group-owner');
    expect(pendingDemoAccessStore.getProfileId()).toBeNull();
    expect(verifyOtp).toHaveBeenCalledWith({ challengeId: 'challenge-1', code: '123456' });
  });

  it('routes to access preview after successful OTP when no role is selected', async () => {
    const user = userEvent.setup();
    const verifyOtp = vi.fn<AuthService['verifyOtp']>().mockResolvedValue({
      status: 'authenticated',
    });
    const accessStore = createDemoAccessStore(window.sessionStorage);
    const pendingDemoAccessStore = createPendingDemoAccessStore(window.sessionStorage);
    const sessionStore = createAuthSessionStore(
      window.sessionStorage,
      () => new Date('2026-07-17T12:00:00.000Z'),
    );
    const { router } = renderVerification(
      createAuthService(verifyOtp),
      true,
      sessionStore,
      accessStore,
      pendingDemoAccessStore,
    );

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/access-preview'));
    expect(accessStore.getProfile()).toBeNull();
  });

  it('does not activate a pending role when OTP verification fails', async () => {
    const user = userEvent.setup();
    const verifyOtp = vi
      .fn<AuthService['verifyOtp']>()
      .mockRejectedValue(new AuthServiceError('invalid_otp'));
    const accessStore = createDemoAccessStore(window.sessionStorage);
    const pendingDemoAccessStore = createPendingDemoAccessStore(window.sessionStorage);
    pendingDemoAccessStore.setProfileId('member');
    const { router } = renderVerification(
      createAuthService(verifyOtp),
      true,
      createSessionStore(),
      accessStore,
      pendingDemoAccessStore,
    );

    await user.type(screen.getByLabelText('Verification code'), '123456');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'That verification code is incorrect. Try again.',
    );
    expect(router.state.location.pathname).toBe('/auth/verify');
    expect(accessStore.getProfile()).toBeNull();
    expect(pendingDemoAccessStore.getProfileId()).toBe('member');
  });
});
