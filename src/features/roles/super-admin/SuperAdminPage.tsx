import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function SuperAdminPage() {
  const [systemLockout, setSystemLockout] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const clusters = [
    { name: 'Express Logistics North Fleet', users: 24, status: 'Active', health: '99.9%' },
    { name: 'St. Xavier School Bus Cluster', users: 42, status: 'Active', health: '99.8%' },
    { name: 'Bangalore Weekend Cycling Club', users: 15, status: 'Active', health: '100%' },
    { name: 'Mumbai Security Team Alpha', users: 31, status: 'Maintenance', health: '94.2%' },
  ];

  const handleToggleLockout = () => {
    setSystemLockout(!systemLockout);
    setActionMessage(
      !systemLockout
        ? 'System Emergency Lockout ENABLED. Non-admin logins restricted.'
        : 'System Lockout cleared. Regular access restored.',
    );
    setTimeout(() => setActionMessage(''), 5000);
  };

  return (
    <section aria-labelledby="super-admin-title" className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-primary">
              Global Platform Governance
            </span>
            <Badge variant="info">Super Admin Level</Badge>
          </div>
          <h1 id="super-admin-title" className="text-heading-xl font-bold tracking-tight text-foreground">
            System Infrastructure & Cluster Oversight
          </h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            Monitor system-wide cluster health, manage cross-group RBAC overrides, control API quota failovers, and execute global maintenance procedures.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant={systemLockout ? 'danger' : 'outline'}
            size="sm"
            onClick={handleToggleLockout}
          >
            {systemLockout ? '🚨 LOCKOUT ACTIVE (Click to Unlock)' : '⚠️ Emergency Lockout'}
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div
          role="status"
          className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-body-sm font-semibold text-primary"
        >
          {actionMessage}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-heading-md font-semibold text-foreground">System Health Telemetry</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">API Gateway Uptime</span>
              <span className="font-semibold text-success">99.98%</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">GPS Telemetry Engine</span>
              <span className="font-semibold text-success">Active (12ms latency)</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Active WebSockets</span>
              <span className="font-semibold text-foreground">312 sessions</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Database Pool</span>
              <span className="font-semibold text-foreground">34% capacity</span>
            </div>
          </div>
          <Button
            fullWidth
            variant={maintenanceMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setMaintenanceMode(!maintenanceMode)}
          >
            {maintenanceMode ? 'Exit Maintenance Mode' : 'Schedule Database Maintenance'}
          </Button>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-md font-semibold text-foreground">Active Clusters Overview</h2>
            <Badge variant="neutral">{clusters.length} Clusters</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Cluster Name</th>
                  <th className="pb-3 font-semibold">Participants</th>
                  <th className="pb-3 font-semibold">Health Score</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 text-right font-semibold">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clusters.map((c) => (
                  <tr key={c.name} className="transition-colors hover:bg-surface-muted/50">
                    <td className="py-3 font-semibold text-foreground">{c.name}</td>
                    <td className="py-3 text-foreground">{c.users} users</td>
                    <td className="py-3 font-medium text-success">{c.health}</td>
                    <td className="py-3">
                      <Badge variant={c.status === 'Active' ? 'success' : 'warning'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="ghost">Inspect</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
