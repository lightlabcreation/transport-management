import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import type { DemoAccessProfile } from '@/features/access-control';
import { getApplicationNavigation } from '@/features/app-navigation';
import { browserApplicationModeStore } from '@/features/application-mode';
import type { AuthSessionStore } from '@/features/auth';
import { ApplicationShell } from '@/features/shell';

import { getDashboardPresentation } from './dashboard.access';
import {
  driverActivity,
  operationMetrics,
  recentTrips,
  systemStatuses,
  weeklyActivity,
} from './dashboard.data';
import type { DashboardCapabilities } from './dashboard.types';

interface DashboardPageProps {
  sessionStore: AuthSessionStore;
  accessProfile: DemoAccessProfile | null;
}

export function DashboardPage({ sessionStore, accessProfile }: DashboardPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState('');
  const applicationMode = browserApplicationModeStore.getMode();
  const applicationNavigation = applicationMode
    ? getApplicationNavigation(applicationMode, accessProfile)
    : [];

  if (!sessionStore.getSession()) return <Navigate to="/auth/login" replace />;
  if (!accessProfile) return <Navigate to="/app/access-preview" replace />;

  const presentation = getDashboardPresentation(accessProfile);

  function handleLogout() {
    sessionStore.clearSession();
    void navigate('/auth/login', { replace: true });
  }

  function handleQuickAction(action: string) {
    setAnnouncement(`${action} is coming soon.`);
  }

  return (
    <ApplicationShell
      navigationItems={applicationNavigation}
      currentPath={location.pathname}
      userSummary={{
        name: 'Demo Operator',
        mobile: '+•• ••••••3210',
        roleLabel: presentation.profileName,
      }}
      onLogout={handleLogout}
    >
      <div className="space-y-section">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
              {presentation.eyebrow}
            </p>
            <h1 className="mt-2 text-heading-lg font-semibold tracking-tight">
              {presentation.heading}
            </h1>
            <p className="mt-2 max-w-3xl text-body text-muted-foreground">
              {presentation.description}
            </p>
          </div>
          <p className="rounded-full border border-border bg-surface px-4 py-2 text-body-sm text-muted-foreground">
            {presentation.profileName}
          </p>
        </header>

        <p className="rounded-lg border border-warning/40 bg-warning/10 p-4 text-body-sm">
          This is a frontend access preview. Production permissions require backend authorization.
        </p>

        {presentation.restrictedMessage && (
          <section
            aria-label="Restricted access information"
            className="rounded-xl border border-border bg-surface p-5"
          >
            <h2 className="text-heading-sm font-semibold">Restricted access</h2>
            <p className="mt-2 text-body text-muted-foreground">{presentation.restrictedMessage}</p>
          </section>
        )}

        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">
            {presentation.summaryLabel}
          </h2>
          {presentation.metrics.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {presentation.metrics.map((metric, index) => (
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
          ) : (
            <p className="rounded-xl border border-dashed border-border p-6 text-muted-foreground">
              Select a valid demo profile to load a dashboard summary.
            </p>
          )}
        </section>

        <div className="grid gap-section xl:grid-cols-[1.35fr_0.65fr]">
          <FocusSection
            heading={presentation.focusHeading}
            items={presentation.focusItems}
            capabilities={presentation.capabilities}
          />
          <QuickActions
            actions={presentation.quickActions}
            isReadOnly={presentation.capabilities.isReadOnly}
            onAction={handleQuickAction}
            announcement={announcement}
          />
        </div>

        {presentation.capabilities.canViewTrips ? (
          <OperationsOverview />
        ) : (
          <section className="rounded-xl border border-border bg-surface p-page shadow-sm">
            <h2 className="text-heading-sm font-semibold">Trip information</h2>
            <p className="mt-2 text-body text-muted-foreground">
              Trip operations are not included in this demo profile presentation.
            </p>
          </section>
        )}

        <div className="grid gap-section xl:grid-cols-2">
          {presentation.capabilities.canViewTrips && (
            <RecentTrips heading={presentation.recentHeading} />
          )}
          <RecentActivity heading={presentation.activityHeading} />
        </div>

        <CapabilityExplanation capabilities={presentation.capabilities} />
        <SystemStatus />
      </div>
    </ApplicationShell>
  );
}

function FocusSection({
  heading,
  items,
  capabilities,
}: {
  heading: string;
  items: readonly string[];
  capabilities: DashboardCapabilities;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-page shadow-sm">
      <h2 className="text-heading-sm font-semibold">{heading}</h2>
      <p className="mt-1 text-body-sm text-muted-foreground">
        Information prioritized for this frontend profile.
      </p>
      {items.length > 0 ? (
        <ul className="mt-5 grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item} className="rounded-lg bg-surface-muted p-4 text-body-sm font-medium">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-body-sm text-muted-foreground">No profile focus is available.</p>
      )}
      {capabilities.canApproveRequests && (
        <p className="mt-5 text-body-sm font-semibold text-primary">
          Request-review presentation is available for this profile.
        </p>
      )}
    </section>
  );
}

function QuickActions({
  actions,
  isReadOnly,
  onAction,
  announcement,
}: {
  actions: readonly string[];
  isReadOnly: boolean;
  onAction: (action: string) => void;
  announcement: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-surface p-page shadow-sm">
      <h2 className="text-heading-sm font-semibold">Quick actions</h2>
      <p className="mt-1 text-body-sm text-muted-foreground">
        {isReadOnly
          ? 'Actions are restricted for this profile.'
          : 'Profile-focused preview shortcuts.'}
      </p>
      {actions.length > 0 ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {actions.map((action) => (
            <Button
              key={action}
              variant="outline"
              className="justify-start"
              onClick={() => onAction(action)}
            >
              {action}
              <span aria-hidden="true" className="ml-auto">
                →
              </span>
            </Button>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-lg bg-surface-muted p-4 text-body-sm">
          No management actions are available in this read-only preview.
        </p>
      )}
      <p
        role="status"
        aria-live="polite"
        className="mt-4 min-h-6 text-body-sm font-medium text-primary"
      >
        {announcement}
      </p>
    </section>
  );
}

function OperationsOverview() {
  return (
    <section
      className="rounded-xl border border-border bg-surface p-page shadow-sm"
      aria-labelledby="operations-heading"
    >
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 id="operations-heading" className="text-heading-sm font-semibold">
            Operations overview
          </h2>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Current simulated trip distribution
          </p>
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
  );
}

function RecentTrips({ heading }: { heading: string }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border p-page">
        <h2 className="text-heading-sm font-semibold">{heading}</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">Latest simulated journeys</p>
      </div>
      <div className="divide-y divide-border">
        {recentTrips.map((trip) => (
          <article key={trip.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
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
  );
}

function RecentActivity({ heading }: { heading: string }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-page shadow-sm">
      <h2 className="text-heading-sm font-semibold">{heading}</h2>
      <p className="mt-1 text-body-sm text-muted-foreground">Latest simulated updates</p>
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
  );
}

function CapabilityExplanation({ capabilities }: { capabilities: DashboardCapabilities }) {
  const labels = [
    ['View trips', capabilities.canViewTrips],
    ['Manage members', capabilities.canManageMembers],
    ['Approve requests', capabilities.canApproveRequests],
    ['Review alerts', capabilities.canReviewAlerts],
    ['Management shortcuts', capabilities.canUseManagementShortcuts],
  ] as const;
  return (
    <section
      aria-labelledby="access-heading"
      className="rounded-xl border border-border bg-surface p-page shadow-sm"
    >
      <h2 id="access-heading" className="text-heading-sm font-semibold">
        Access explanation
      </h2>
      <p className="mt-1 text-body-sm text-muted-foreground">
        These flags change frontend presentation only and do not provide security enforcement.
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {labels.map(([label, enabled]) => (
          <li
            key={label}
            className={`rounded-full px-3 py-2 text-body-sm font-medium ${enabled ? 'bg-success/10 text-success' : 'bg-surface-muted text-muted-foreground'}`}
          >
            {label}: {enabled ? 'Available' : 'Restricted'}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SystemStatus() {
  return (
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
