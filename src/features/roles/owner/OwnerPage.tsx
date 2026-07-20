import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MOCK_PLATFORM_STATS,
  MOCK_PENDING_APPROVALS,
  MOCK_PLATFORM_USERS,
  MOCK_PLATFORM_ALERTS,
} from './owner.data';
import { PlatformStatsCards } from './components/PlatformStatsCards';
import { PendingApprovalsQueue } from './components/PendingApprovalsQueue';
import { UserManagementTable } from './components/UserManagementTable';
import { PlatformAlertsFeed } from './components/PlatformAlertsFeed';

export function OwnerPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'users' | 'alerts'>(
    'overview',
  );

  const pendingCount = MOCK_PENDING_APPROVALS.filter((a) => a.status === 'pending').length;
  const activeAlertsCount = MOCK_PLATFORM_ALERTS.filter((a) => !a.resolved).length;

  return (
    <section aria-labelledby="owner-page-title" className="space-y-6 pb-12">
      {/* Top Header & Platform Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-primary">
              Platform Owner Command Center
            </span>
            <Badge variant="success">System Healthy</Badge>
            <Badge variant="neutral">GPS Engine v2.4</Badge>
          </div>
          <h1 id="owner-page-title" className="text-heading-xl font-bold tracking-tight text-foreground">
            Platform Administration & Fleet Oversight
          </h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            Supervise all 1,400+ participants, review pending group join/creation requests, oversee API usage thresholds, and monitor real-time speed limit violations.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <svg
              className="mr-2 size-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <Button
          size="sm"
          variant={activeTab === 'overview' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview & KPIs
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'approvals' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('approvals')}
          className="relative"
        >
          ⏳ Pending Group Approvals
          {pendingCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-warning px-2 py-0.5 text-body-xs font-bold text-warning-foreground">
              {pendingCount}
            </span>
          )}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'users' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('users')}
        >
          👥 Platform User Directory ({MOCK_PLATFORM_USERS.length})
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'alerts' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 System & Speed Feed
          {activeAlertsCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-danger px-2 py-0.5 text-body-xs font-bold text-danger-foreground">
              {activeAlertsCount}
            </span>
          )}
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <PlatformStatsCards stats={MOCK_PLATFORM_STATS} />

          {/* Platform Owner Quick Actions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">
                  💳
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Payments & Billing</h3>
                  <p className="text-body-sm text-muted-foreground">Manage subscriptions</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => window.location.assign('/app/payments')}
              >
                Go to Billing
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-info/10 text-xl">
                  📊
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">API Cost Monitoring</h3>
                  <p className="text-body-sm text-muted-foreground">Review map usage</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => window.location.assign('/app/cost-monitoring')}
              >
                View Costs
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-xl">
                  💬
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp Invites</h3>
                  <p className="text-body-sm text-muted-foreground">QR & links for groups</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => window.location.assign('/app/whatsapp-invites')}
              >
                Manage Invites
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PendingApprovalsQueue initialApprovals={MOCK_PENDING_APPROVALS} />
            <PlatformAlertsFeed initialAlerts={MOCK_PLATFORM_ALERTS} />
          </div>

          <UserManagementTable initialUsers={MOCK_PLATFORM_USERS} />
        </div>
      )}

      {activeTab === 'approvals' && (
        <PendingApprovalsQueue initialApprovals={MOCK_PENDING_APPROVALS} />
      )}

      {activeTab === 'users' && <UserManagementTable initialUsers={MOCK_PLATFORM_USERS} />}

      {activeTab === 'alerts' && <PlatformAlertsFeed initialAlerts={MOCK_PLATFORM_ALERTS} />}
    </section>
  );
}
