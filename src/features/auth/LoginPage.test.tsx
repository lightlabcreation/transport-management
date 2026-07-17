import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { AuthServiceError, type AuthService } from './authService';
import { LoginPage } from './LoginPage';

function renderLogin(authService: AuthService) {
  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <LoginPage authService={authService} /> },
      { path: '/auth/verify', element: <h1>Verification boundary</h1> },
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
  };
}

describe('LoginPage', () => {
  it('renders only the passwordless Login controls', () => {
    renderLogin(createAuthService(vi.fn()));

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument();
    expect(screen.getByLabelText('Country code')).toHaveAttribute(
      'autocomplete',
      'tel-country-code',
    );
    expect(screen.getByLabelText('Mobile number')).toHaveAttribute('autocomplete', 'tel-national');
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/forgot password/i)).not.toBeInTheDocument();
  });

  it('reports empty fields and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    renderLogin(createAuthService(vi.fn()));

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByLabelText('Country code')).toHaveFocus();
    expect(screen.getByLabelText('Country code')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Mobile number')).toHaveAttribute('aria-invalid', 'true');
  });

  it('normalizes the number and navigates after OTP is sent', async () => {
    const user = userEvent.setup();
    const requestOtp = vi.fn<AuthService['requestOtp']>().mockResolvedValue({
      status: 'otp_sent',
      source: 'login',
      challengeId: 'challenge-1',
      maskedMobile: '+•• ••••••3210',
      expiresAt: '2026-07-17T12:00:00.000Z',
    });
    const router = renderLogin(createAuthService(requestOtp));

    await user.type(screen.getByLabelText('Country code'), '+91');
    await user.type(screen.getByLabelText('Mobile number'), '98765 43210');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/verify'));
    expect(requestOtp).toHaveBeenCalledOnce();
    expect(requestOtp).toHaveBeenCalledWith({ mobileNumber: '+919876543210' });
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

    await user.type(screen.getByLabelText('Country code'), '+91');
    await user.type(screen.getByLabelText('Mobile number'), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const button = screen.getByRole('button', { name: 'Continue' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(requestOtp).toHaveBeenCalledOnce();

    resolveRequest({
      status: 'otp_sent',
      source: 'login',
      challengeId: 'challenge-1',
      maskedMobile: '+•• ••••••3210',
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

    await user.type(screen.getByLabelText('Country code'), '+91');
    await user.type(screen.getByLabelText('Mobile number'), '9876543210');
    await user.click(screen.getByRole('button', { name: 'Continue' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(message);
    expect(alert).toHaveFocus();
  });
});
