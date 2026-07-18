import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

type NotificationFilter = 'all' | 'unread' | 'read';

interface DemoNotification {
  id: string;
  title: string;
  description: string;
  destination: string;
  time: string;
  isRead: boolean;
}

const initialNotifications: DemoNotification[] = [
  {
    id: 'notification-speed',
    title: 'Speed alert reviewed',
    description: 'A simulated speed event on NH-48 is ready for review.',
    destination: 'Alerts',
    time: '5 minutes ago',
    isRead: false,
  },
  {
    id: 'notification-trip',
    title: 'Trip completed',
    description: 'Trip TR-2048 reached its simulated destination.',
    destination: 'Trips',
    time: '32 minutes ago',
    isRead: false,
  },
  {
    id: 'notification-group',
    title: 'Group activity updated',
    description: 'A new frontend-only activity update is available.',
    destination: 'Groups',
    time: 'Yesterday',
    isRead: true,
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [announcement, setAnnouncement] = useState('');

  const visibleNotifications = useMemo(
    () =>
      notifications.filter((notification) => {
        if (filter === 'unread') return !notification.isRead;
        if (filter === 'read') return notification.isRead;
        return true;
      }),
    [filter, notifications],
  );
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  function markAsRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    );
    setAnnouncement('Notification marked as read.');
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
    setAnnouncement('All notifications marked as read.');
  }

  return (
    <div className="space-y-section">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
            Account updates
          </p>
          <h2 className="mt-2 text-heading-lg font-semibold">Notifications</h2>
          <p className="mt-2 max-w-2xl text-body text-muted-foreground">
            Review simulated transport, safety, and account activity in one place.
          </p>
        </div>
        <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
          Mark all as read
        </Button>
      </header>

      <section aria-label="Notification summary" className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total" value={notifications.length} />
        <SummaryCard label="Unread" value={unreadCount} />
        <SummaryCard label="Read" value={notifications.length - unreadCount} />
      </section>

      <section className="rounded-xl border border-border bg-surface shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-page sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-heading-sm font-semibold">Notification inbox</h3>
          <div role="group" aria-label="Notification filters" className="flex flex-wrap gap-2">
            {(['all', 'unread', 'read'] as const).map((option) => (
              <Button
                key={option}
                size="sm"
                variant={filter === option ? 'primary' : 'outline'}
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
              >
                {option[0]?.toUpperCase()}
                {option.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {visibleNotifications.length > 0 ? (
          <ul className="divide-y divide-border" aria-label="Notifications">
            {visibleNotifications.map((notification) => (
              <li key={notification.id} className="p-page">
                <article className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span
                    aria-hidden="true"
                    className={`mt-2 size-2 shrink-0 rounded-full ${notification.isRead ? 'bg-border' : 'bg-primary'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.isRead ? (
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-body-xs font-semibold text-primary">
                          Unread
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-body-sm text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="mt-2 text-body-xs text-muted-foreground">
                      {notification.time} · Preview destination: {notification.destination}
                    </p>
                  </div>
                  {!notification.isRead ? (
                    <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                      Mark as read
                    </Button>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div role="status" className="p-section text-center text-muted-foreground">
            No notifications match this filter.
          </div>
        )}
      </section>

      <p role="status" aria-live="polite" className="min-h-6 text-body-sm text-primary">
        {announcement}
      </p>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-heading-md font-semibold">{value}</p>
    </article>
  );
}
