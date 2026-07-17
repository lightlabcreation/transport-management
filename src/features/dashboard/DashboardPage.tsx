import { useState } from 'react';

import { Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { ApplicationShell, type NavigationItem } from '@/features/shell';
import type { AuthSessionStore } from '@/features/auth';

import {
  driverActivity,
  operationMetrics,
  recentTrips,
  summaryMetrics,
  systemStatuses,
  weeklyActivity,
} from './dashboard.data';

interface DashboardPageProps {
  sessionStore: AuthSessionStore;
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', ariaLabel: 'Dashboard' },
];

const quickActions = ['Add Vehicle', 'Add Driver', 'Create Trip', 'Create Group'] as const;

export function DashboardPage({ sessionStore }: DashboardPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState('');

  if (!sessionStore.getSession()) return <Navigate to="/auth/login" replace />;

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  function handleQuickAction(action: (typeof quickActions)[number]) {
    setAnnouncement(`${action} is coming soon.`);
  }

  return (
    <ApplicationShell
      navigationItems={navigationItems}
      currentPath={location.pathname}
      userSummary={{ name: 'Demo Operator', mobile: '+•• ••••••3210', roleLabel: 'Operations' }}
      onLogout={handleLogout}
    >
      <div className="space-y-section">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
              Operations command center
            </p>
            <h1 className="mt-2 text-heading-lg font-semibold tracking-tight">Good afternoon</h1>
            <p className="mt-2 text-body text-muted-foreground">
              Here is today’s transport operations overview.
            </p>
          </div>
          <p className="rounded-full border border-border bg-surface px-4 py-2 text-body-sm text-muted-foreground">
            Live frontend preview
          </p>
        </header>

        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">
            Fleet summary
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {summaryMetrics.map((metric, index) => (
              <article
                key={metric.label}
                className="rounded-xl border border-border bg-surface p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-body-sm font-medium text-muted-foreground">{metric.label}</p>
                  <span
                    aria-hidden="true"
                    className="grid size-9 place-items-center rounded-lg bg-primary/10 font-semibold text-primary"
                  >
                    {index + 1}
                  </span>
                </div>
                <p className="mt-4 text-heading-lg font-semibold">{metric.value}</p>
                <p className="mt-1 text-body-sm text-muted-foreground">{metric.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="grid gap-section xl:grid-cols-[1.35fr_0.65fr]">
          <section
            aria-labelledby="operations-heading"
            className="rounded-xl border border-border bg-surface p-page shadow-sm"
          >
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 id="operations-heading" className="text-heading-sm font-semibold">
                  Operations overview
                </h2>
                <p className="mt-1 text-body-sm text-muted-foreground">Current trip distribution</p>
              </div>
              <span className="text-body-sm text-muted-foreground">Today</span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {operationMetrics.map((metric) => (
                <OperationMetric key={metric.label} {...metric} />
              ))}
            </div>
            <div className="mt-8 border-t border-border pt-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-body font-semibold">Weekly trip activity</h3>
                <span className="text-body-sm text-muted-foreground">220 trips</span>
              </div>
              <div
                className="flex h-48 items-end justify-between gap-3"
                role="img"
                aria-label="Weekly trip activity: Monday 28, Tuesday 36, Wednesday 31, Thursday 44, Friday 39, Saturday 24, Sunday 18 trips"
              >
                {weeklyActivity.map((item) => (
                  <div
                    key={item.day}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-body-sm font-medium">{item.trips}</span>
                    <span
                      className="w-full max-w-10 rounded-t-md bg-primary/80"
                      style={{ height: `${(item.trips / 44) * 75}%` }}
                    />
                    <span className="text-body-sm text-muted-foreground">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            aria-labelledby="actions-heading"
            className="rounded-xl border border-border bg-surface p-page shadow-sm"
          >
            <h2 id="actions-heading" className="text-heading-sm font-semibold">
              Quick actions
            </h2>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Frequently used operation shortcuts
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {quickActions.map((action) => (
                <Button
                  key={action}
                  variant="outline"
                  className="justify-start"
                  onClick={() => handleQuickAction(action)}
                >
                  {action}
                  <span aria-hidden="true" className="ml-auto">
                    →
                  </span>
                </Button>
              ))}
            </div>
            <p
              role="status"
              aria-live="polite"
              className="mt-4 min-h-6 text-body-sm font-medium text-primary"
            >
              {announcement}
            </p>
          </section>
        </div>

        <div className="grid gap-section xl:grid-cols-2">
          <section
            aria-labelledby="trips-heading"
            className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
          >
            <div className="border-b border-border p-page">
              <h2 id="trips-heading" className="text-heading-sm font-semibold">
                Recent trips
              </h2>
              <p className="mt-1 text-body-sm text-muted-foreground">
                Latest scheduled and active journeys
              </p>
            </div>
            <div className="divide-y divide-border">
              {recentTrips.map((trip) => (
                <article
                  key={trip.id}
                  className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{trip.id}</span>
                      <StatusPill status={trip.status} />
                    </div>
                    <p className="mt-1 text-body-sm">{trip.route}</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">{trip.driver}</p>
                  </div>
                  <time className="text-body-sm text-muted-foreground">{trip.time}</time>
                </article>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="drivers-heading"
            className="rounded-xl border border-border bg-surface p-page shadow-sm"
          >
            <h2 id="drivers-heading" className="text-heading-sm font-semibold">
              Recent driver activity
            </h2>
            <p className="mt-1 text-body-sm text-muted-foreground">Latest operational updates</p>
            <div className="mt-5 space-y-5">
              {driverActivity.map((item) => (
                <article key={item.name} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-body-sm font-semibold text-primary"
                  >
                    {item.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-body-sm text-muted-foreground">{item.activity}</p>
                  </div>
                  <time className="shrink-0 text-body-sm text-muted-foreground">{item.time}</time>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section aria-labelledby="status-heading">
          <div className="mb-4">
            <h2 id="status-heading" className="text-heading-sm font-semibold">
              System status
            </h2>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Frontend service and device overview
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {systemStatuses.map((status) => (
              <article
                key={status.label}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className={`size-3 rounded-full ${status.tone === 'success' ? 'bg-success' : 'bg-warning'}`}
                />
                <div>
                  <h3 className="font-medium">{status.label}</h3>
                  <p className="text-body-sm">{status.value}</p>
                  <p className="text-body-sm text-muted-foreground">{status.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ApplicationShell>
  );
}

function OperationMetric({ label, value, tone }: { label: string; value: number; tone: string }) {
  const toneClass =
    tone === 'danger'
      ? 'text-danger'
      : tone === 'warning'
        ? 'text-warning'
        : tone === 'success'
          ? 'text-success'
          : 'text-primary';
  return (
    <article className="rounded-lg bg-surface-muted p-4">
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-heading-md font-semibold ${toneClass}`}>{value}</p>
    </article>
  );
}

function StatusPill({ status }: { status: string }) {
  const toneClass =
    status === 'Completed'
      ? 'bg-success/10 text-success'
      : status === 'Pending'
        ? 'bg-warning/10 text-warning-foreground'
        : 'bg-primary/10 text-primary';
  return (
    <span className={`rounded-full px-2 py-1 text-body-sm font-medium ${toneClass}`}>{status}</span>
  );
}
