import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createPendingDemoAccessStore,
  createDemoAccessStore,
  type PendingDemoAccessStore,
  type DemoAccessStore,
} from '@/features/access-control';

import { AuthServiceError, type AuthService } from './authService';
import { LoginPage } from './LoginPage';

function renderLogin(
  authService: AuthService,
  pendingDemoAccessStore?: PendingDemoAccessStore,
  accessStore?: DemoAccessStore,
) {
  const router = createMemoryRouter(
    [
      {
        path: '/auth/login',
        element: (
          <LoginPage
            authService={authService}
            {...(pendingDemoAccessStore ? { pendingDemoAccessStore } : {})}
            {...(accessStore ? { accessStore } : {})}
          />
        ),
      },
      { path: '/auth/verify', element: <h1>Verification boundary</h1> },
      { path: '/auth/authenticated', element: <h1>Authenticated boundary</h1> },
      { path: '/app/access-preview', element: <h1>Access preview boundary</h1> },
    ],
    { initialEntries: ['/auth/login'] },
  );

  render(<RouterProvider router={router} />);
  return router;
}

function createAuthService(requestOtp: AuthService['requestOtp']): AuthService {
  return {
    requestOtp,
    register: vi.fn<AuthService['register']>(),
    verifyOtp: vi.fn<AuthService['verifyOtp']>(),
    loginWithPassword: vi.fn<NonNullable<AuthService['loginWithPassword']>>().mockResolvedValue({
      status: 'authenticated',
    }),
  };
}

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('LoginPage', () => {
  it('renders passwordless controls and the optional demo role selector along with Send OTP and Login buttons', () => {
    renderLogin(createAuthService(vi.fn()));

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Demo roles' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(6);
    expect(screen.getByText(/frontend demo access preview only/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Country code')).toHaveAttribute(
      'autocomplete',
      'tel-country-code',
    );
    expect(screen.getByLabelText('Mobile number')).toHaveAttribute('autocomplete', 'tel-national');
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryByText(/forgot password/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send OTP' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('reports empty fields and focuses the first invalid field when Send OTP is clicked', async () => {
    const user = userEvent.setup();
    renderLogin(createAuthService(vi.fn()));

    await user.click(screen.getByRole('button', { name: 'Send OTP' }));

    expect(screen.getByLabelText('Country code')).toHaveFocus();
    expect(screen.getByLabelText('Country code')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Mobile number')).toHaveAttribute('aria-invalid', 'true');
  });

  it('reports error when Login is clicked without a password entered', async () => {
    const user = userEvent.setup();
    renderLogin(createAuthService(vi.fn()));

    await user.selectOptions(screen.getByLabelText('Country code'), '+91');
    await user.type(screen.getByLabelText('Mobile number'), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Please enter your password to log in directly/i);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText(/password/i)).toHaveFocus();
  });

  it('auto-fills credentials when a demo role is selected and navigates to authenticated boundary via Login button', async () => {
    const user = userEvent.setup();
    const loginWithPassword = vi.fn().mockResolvedValue({ status: 'authenticated' });
    const authService: AuthService = {
      requestOtp: vi.fn(),
      register: vi.fn(),
      verifyOtp: vi.fn(),
      loginWithPassword,
    };
    const pendingStore = createPendingDemoAccessStore(window.sessionStorage);
    const accessStore = createDemoAccessStore(window.sessionStorage);
    const router = renderLogin(authService, pendingStore, accessStore);

    await user.click(screen.getByRole('radio', { name: /Group Owner/i }));

    expect(screen.getByLabelText('Country code')).toHaveValue('+91');
    expect(screen.getByLabelText('Mobile number')).toHaveValue('9876543210');
    expect(screen.getByLabelText(/password/i)).toHaveValue('demo@owner');

    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/authenticated'));
    expect(loginWithPassword).toHaveBeenCalledOnce();
    expect(loginWithPassword).toHaveBeenCalledWith({
      mobileNumber: '+919876543210',
      password: 'demo@owner',
    });
    expect(accessStore.getProfile()?.id).toBe('group-owner');
  });

  it('normalizes the number and navigates after OTP is sent via Send OTP button', async () => {
    const user = userEvent.setup();
    const requestOtp = vi.fn<AuthService['requestOtp']>().mockResolvedValue({
      status: 'otp_sent',
      source: 'login',
      challengeId: 'challenge-1',
      maskedMobile: '+.. ......3210',
      expiresAt: '2026-07-17T12:00:00.000Z',
    });
    const router = renderLogin(createAuthService(requestOtp));

    await user.selectOptions(screen.getByLabelText('Country code'), '+91');
    await user.type(screen.getByLabelText('Mobile number'), '98765 43210');
    await user.click(screen.getByRole('button', { name: 'Send OTP' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/verify'));
    expect(requestOtp).toHaveBeenCalledOnce();
    expect(requestOtp).toHaveBeenCalledWith({ mobileNumber: '+919876543210', password: undefined });
  });

  it('prevents duplicate submission while loading', async () => {
    const user = userEvent.setup();
    let resolveRequest: AuthService['requestOtp'] extends (...args: never[]) => Promise<infer T>
      ? (value: T) => void
      : never = vi.fn();
    const requestOtp = vi.fn<AuthService['requestOtp']>().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );
    renderLogin(createAuthService(requestOtp));

    await user.selectOptions(screen.getByLabelText('Country code'), '+91');
    await user.type(screen.getByLabelText('Mobile number'), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Send OTP' }));

    const button = screen.getByRole('button', { name: 'Send OTP' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(requestOtp).toHaveBeenCalledOnce();

    resolveRequest({
      status: 'otp_sent',
      source: 'login',
      challengeId: 'challenge-1',
      maskedMobile: '+.. ......3210',
      expiresAt: '2026-07-17T12:00:00.000Z',
    });
  });

  it.each([
    ['rate_limited', 'Too many requests. Please wait before trying again.'],
    ['network', 'Unable to connect. Check your connection and try again.'],
    ['unavailable', 'Sign in is temporarily unavailable. Please try again.'],
  ] as const)('shows and focuses a safe %s failure', async (code, message) => {
    const user = userEvent.setup();
    const requestOtp = vi
      .fn<AuthService['requestOtp']>()
      .mockRejectedValue(new AuthServiceError(code));
    renderLogin(createAuthService(requestOtp));

    await user.selectOptions(screen.getByLabelText('Country code'), '+91');
    await user.type(screen.getByLabelText('Mobile number'), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Send OTP' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(message);
    expect(alert).toHaveFocus();
  });

  it('stores only the selected demo profile before OTP navigation', async () => {
    const user = userEvent.setup();
    const requestOtp = vi.fn<AuthService['requestOtp']>().mockResolvedValue({
      status: 'otp_sent',
      source: 'login',
      challengeId: 'challenge-1',
      maskedMobile: '+.. ......3210',
      expiresAt: '2026-07-17T12:00:00.000Z',
    });
    const pendingStore = createPendingDemoAccessStore(window.sessionStorage);
    const router = renderLogin(createAuthService(requestOtp), pendingStore);

    await user.click(screen.getByRole('radio', { name: /Group Owner/i }));
    await user.click(screen.getByRole('button', { name: 'Send OTP' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/verify'));
    expect(pendingStore.getProfileId()).toBe('group-owner');
    expect(requestOtp).toHaveBeenCalledWith({ mobileNumber: '+919876543210', password: 'demo@owner' });
    expect(window.sessionStorage.getItem('transport-management.demo-access-pending-profile')).toBe(
      JSON.stringify({ profileId: 'group-owner' }),
    );
  });

  it('clears a pending profile when requesting an OTP fails', async () => {
    const user = userEvent.setup();
    const pendingStore = createPendingDemoAccessStore(window.sessionStorage);
    const requestOtp = vi
      .fn<AuthService['requestOtp']>()
      .mockRejectedValue(new Error('request failed'));
    renderLogin(createAuthService(requestOtp), pendingStore);

    await user.click(screen.getByDisplayValue('member'));
    await user.click(screen.getByRole('button', { name: 'Send OTP' }));

    await screen.findByRole('alert');
    expect(pendingStore.getProfileId()).toBeNull();
  });
});
