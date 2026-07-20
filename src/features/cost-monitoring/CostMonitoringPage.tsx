import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MOCK_API_SERVICES, MOCK_BUDGET_CONFIG, MOCK_API_LOGS } from './cost-monitoring.data';
import { ApiUsageCards } from './components/ApiUsageCards';
import { BudgetThresholdCard } from './components/BudgetThresholdCard';
import { ApiRequestLogTable } from './components/ApiRequestLogTable';
import { ApiKeysConfigTable } from './components/ApiKeysConfigTable';

export function CostMonitoringPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'budget' | 'logs'>('overview');

  return (
    <section aria-labelledby="cost-monitoring-title" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-warning">
              Financial Oversight & Quota Engine
            </span>
            <Badge variant="warning">Billing Cycle Active</Badge>
          </div>
          <h1 id="cost-monitoring-title" className="text-heading-xl font-bold tracking-tight text-foreground">
            API Cost & Quota Monitoring Center
          </h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            Track daily and monthly API expenditures across Google Maps, TomTom speed checking, WhatsApp Business invites, and Firebase Cloud Messaging. Set hard spend caps to avoid billing surprises (`M19`).
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
            Refresh Billing Telemetry
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
          📊 Daily Quota & Cost Breakdown
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'keys' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('keys')}
        >
          🔑 API Keys & Secrets Setup
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'budget' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('budget')}
        >
          💰 Monthly Spend Cap & Lockout Rules
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'logs' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('logs')}
        >
          📜 Real-Time API Audit Trail ({MOCK_API_LOGS.length})
        </Button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <ApiUsageCards services={MOCK_API_SERVICES} />
          <BudgetThresholdCard initialConfig={MOCK_BUDGET_CONFIG} />
          <ApiRequestLogTable initialLogs={MOCK_API_LOGS} />
        </div>
      )}

      {activeTab === 'keys' && <ApiKeysConfigTable />}

      {activeTab === 'budget' && <BudgetThresholdCard initialConfig={MOCK_BUDGET_CONFIG} />}

      {activeTab === 'logs' && <ApiRequestLogTable initialLogs={MOCK_API_LOGS} />}
    </section>
  );
}
