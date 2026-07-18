import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ProfilePage } from './ProfilePage';

describe('ProfilePage', () => {
  it('validates required names and optional email', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await user.clear(screen.getByLabelText('First name'));
    await user.clear(screen.getByLabelText('Email (optional)'));
    await user.type(screen.getByLabelText('Email (optional)'), 'invalid-email');
    await user.click(screen.getByRole('button', { name: 'Save profile' }));

    expect(screen.getByText('Required field.')).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('announces a successful frontend-only save', async () => {
    const user = userEvent.setup();
    render(<ProfilePage />);

    await user.click(screen.getByRole('button', { name: 'Save profile' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Profile changes saved in this frontend preview.',
    );
  });

  it('renders loading and error states', () => {
    const { rerender } = render(<ProfilePage initialViewState="loading" />);
    expect(screen.getByRole('status', { name: 'Loading profile' })).toBeInTheDocument();

    rerender(<ProfilePage initialViewState="error" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Profile unavailable');
  });
});
