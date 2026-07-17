import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { AuthServiceError, type AuthService } from './authService';
import { RegistrationPage } from './RegistrationPage';

function createAuthService(register: AuthService['register']): AuthService {
  return {
    requestOtp: vi.fn<AuthService['requestOtp']>(),
    register,
    verifyOtp: vi.fn<AuthService['verifyOtp']>(),
  };
}

function renderRegistration(authService: AuthService) {
  const router = createMemoryRouter(
    [
      { path: '/auth/register', element: <RegistrationPage authService={authService} /> },
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      { path: '/auth/verify', element: <h1>Verification boundary</h1> },
      { path: '/legal/terms', element: <h1>Terms boundary</h1> },
    ],
    { initialEntries: ['/auth/register'] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

async function completeRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('First name'), '  Priya  ');
  await user.type(screen.getByLabelText('Last name'), '  Sharma  ');
  await user.type(screen.getByLabelText('Country code'), '+91');
  await user.type(screen.getByLabelText('Mobile number'), '98765 43210');
  await user.click(screen.getByLabelText(/I accept the Terms/i));
}

describe('RegistrationPage', () => {
  it('renders the approved passwordless fields and English language option', () => {
    renderRegistration(createAuthService(vi.fn()));

    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email (optional)')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Language')).toHaveValue('en');
    expect(screen.getByRole('option', { name: 'English' })).toHaveValue('en');
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it('reports required fields and focuses the first invalid control', async () => {
    const user = userEvent.setup();
    renderRegistration(createAuthService(vi.fn()));

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByLabelText('First name')).toHaveFocus();
    expect(screen.getByText('Accept the Terms to create your account.')).toBeInTheDocument();
  });

  it('normalizes values and passes a registration challenge to OTP', async () => {
    const user = userEvent.setup();
    const register = vi.fn<AuthService['register']>().mockResolvedValue({
      status: 'otp_sent',
      source: 'registration',
      challengeId: 'registration-1',
      maskedMobile: '+•• ••••••3210',
      expiresAt: '2030-01-01T00:05:00.000Z',
    });
    const router = renderRegistration(createAuthService(register));
    await completeRequiredFields(user);

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/auth/verify'));
    expect(register).toHaveBeenCalledWith({
      firstName: 'Priya',
      lastName: 'Sharma',
      mobileNumber: '+919876543210',
      language: 'en',
      acceptedTerms: true,
    });
    expect(router.state.location.state).toEqual({
      source: 'registration',
      challengeId: 'registration-1',
      maskedMobile: '+•• ••••••3210',
      expiresAt: '2030-01-01T00:05:00.000Z',
    });
  });

  it('validates an optional email only when supplied', async () => {
    const user = userEvent.setup();
    const register = vi.fn<AuthService['register']>();
    renderRegistration(createAuthService(register));
    await completeRequiredFields(user);
    await user.type(screen.getByLabelText('Email (optional)'), 'invalid');

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(
      screen.getByText('Enter a valid email address or leave this field empty.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email (optional)')).toHaveFocus();
    expect(register).not.toHaveBeenCalled();
  });

  it('shows and focuses a safe service failure while preserving the form', async () => {
    const user = userEvent.setup();
    const register = vi
      .fn<AuthService['register']>()
      .mockRejectedValue(new AuthServiceError('duplicate_account'));
    renderRegistration(createAuthService(register));
    await completeRequiredFields(user);

    await user.click(screen.getByRole('button', { name: 'Create account' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/account may already exist/i);
    expect(alert).toHaveFocus();
    expect(screen.getByLabelText('First name')).toHaveValue('  Priya  ');
  });
});
