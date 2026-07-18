import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SettingsPage } from './SettingsPage';

describe('SettingsPage', () => {
  it('shows tracking settings only in tracking mode', () => {
    const { rerender } = render(<SettingsPage mode="tracking" onLogout={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Tracking settings' })).toBeInTheDocument();

    rerender(<SettingsPage mode="speed" onLogout={vi.fn()} />);
    expect(screen.queryByRole('heading', { name: 'Tracking settings' })).not.toBeInTheDocument();
  });

  it('updates local preferences and announces a save', async () => {
    const user = userEvent.setup();
    render(<SettingsPage mode="tracking" onLogout={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: /dark/i }));
    await user.click(screen.getByRole('button', { name: 'Save settings' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Settings saved for this frontend preview.',
    );
  });

  it('delegates logout to the centralized application callback', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    render(<SettingsPage mode="speed" onLogout={onLogout} />);

    await user.click(screen.getByRole('button', { name: 'Log out' }));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
