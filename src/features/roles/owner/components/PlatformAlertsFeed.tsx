import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PlatformAlert } from '../owner.types';

interface PlatformAlertsFeedProps {
  initialAlerts: PlatformAlert[];
}

export function PlatformAlertsFeed({ initialAlerts }: PlatformAlertsFeedProps) {
  const [alerts, setAlerts] = useState<PlatformAlert[]>(initialAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    if (filterSeverity === 'active') return !a.resolved;
    return a.severity === filterSeverity;
  });

  const activeCount = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-heading-md font-semibold tracking-tight text-foreground">
            Platform System & Speed Violations Feed
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Live telemetry alerts, API quota thresholds, and severe overspeed incidents across all
            groups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={activeCount > 0 ? 'danger' : 'success'}>
            {activeCount} Active System Alerts
          </Badge>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-b border-border pb-4">
        <Button
          size="sm"
          variant={filterSeverity === 'all' ? 'primary' : 'ghost'}
          onClick={() => setFilterSeverity('all')}
        >
          All Alerts ({alerts.length})
        </Button>
        <Button
          size="sm"
          variant={filterSeverity === 'active' ? 'primary' : 'ghost'}
          onClick={() => setFilterSeverity('active')}
        >
          Active Only ({activeCount})
        </Button>
        <Button
          size="sm"
          variant={filterSeverity === 'danger' ? 'primary' : 'ghost'}
          onClick={() => setFilterSeverity('danger')}
        >
          Critical Violations ({alerts.filter((a) => a.severity === 'danger').length})
        </Button>
        <Button
          size="sm"
          variant={filterSeverity === 'warning' ? 'primary' : 'ghost'}
          onClick={() => setFilterSeverity('warning')}
        >
          API Quota Warnings ({alerts.filter((a) => a.severity === 'warning').length})
        </Button>
      </div>

      <div className="mt-4 space-y-3">
        {filteredAlerts.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-muted-foreground">
            No system alerts match the selected filter criteria.
          </p>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center ${
                alert.resolved
                  ? 'border-border bg-surface-muted/30 opacity-70'
                  : alert.severity === 'danger'
                    ? 'border-danger/30 bg-danger/5'
                    : alert.severity === 'warning'
                      ? 'border-warning/30 bg-warning/5'
                      : 'border-info/30 bg-info/5'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      alert.resolved
                        ? 'neutral'
                        : alert.severity === 'danger'
                          ? 'danger'
                          : alert.severity === 'warning'
                            ? 'warning'
                            : 'info'
                    }
                  >
                    {alert.resolved ? 'RESOLVED' : alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-body-xs text-muted-foreground">{alert.timestamp}</span>
                  {alert.groupName && (
                    <Badge variant="outline" className="text-body-xs">
                      {alert.groupName}
                    </Badge>
                  )}
                </div>
                <h3 className="text-body font-semibold text-foreground">{alert.title}</h3>
                <p className="text-body-sm text-muted-foreground">{alert.description}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {!alert.resolved ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    Mark Resolved
                  </Button>
                ) : (
                  <span className="text-body-xs font-semibold text-success">Cleared</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
