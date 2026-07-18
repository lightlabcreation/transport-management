import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { NotificationsPage } from './NotificationsPage';

describe('NotificationsPage', () => {
  it('filters unread notifications and marks one as read', async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);

    await user.click(screen.getByRole('button', { name: 'Unread' }));
    const list = screen.getByRole('list', { name: 'Notifications' });
    expect(within(list).getAllByRole('article')).toHaveLength(2);

    await user.click(within(list).getAllByRole('button', { name: 'Mark as read' })[0]!);
    expect(screen.getByText('Notification marked as read.')).toBeInTheDocument();
  });

  it('marks every notification as read and shows an empty unread state', async () => {
    const user = userEvent.setup();
    render(<NotificationsPage />);

    await user.click(screen.getByRole('button', { name: 'Mark all as read' }));
    await user.click(screen.getByRole('button', { name: 'Unread' }));

    expect(screen.getByText('No notifications match this filter.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mark all as read' })).toBeDisabled();
  });
});
