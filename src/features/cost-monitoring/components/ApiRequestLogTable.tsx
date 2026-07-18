import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ApiRequestLog, ApiProviderName } from '../cost-monitoring.types';

interface ApiRequestLogTableProps {
  initialLogs: ApiRequestLog[];
}

export function ApiRequestLogTable({ initialLogs }: ApiRequestLogTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');

  const filteredLogs = initialLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      log.endpoint.toLowerCase().includes(query) ||
      (log.groupName && log.groupName.toLowerCase().includes(query));

    const matchesService = selectedService === 'all' || log.service === selectedService;
    return matchesSearch && matchesService;
  });

  const providersList: ApiProviderName[] = [
    'Google Maps',
    'TomTom',
    'WhatsApp',
    'Firebase FCM',
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-heading-md font-semibold tracking-tight text-foreground">
            Live Telemetry API Audit Trail
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Real-time request logs, response latencies, HTTP status codes, and per-call financial attribution.
          </p>
        </div>
        <Badge variant="neutral">{filteredLogs.length} Log Entries</Badge>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search endpoint or group name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search API logs"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={selectedService === 'all' ? 'primary' : 'ghost'}
            onClick={() => setSelectedService('all')}
          >
            All Services
          </Button>
          {providersList.map((svc) => (
            <Button
              key={svc}
              size="sm"
              variant={selectedService === svc ? 'primary' : 'ghost'}
              onClick={() => setSelectedService(svc)}
            >
              {svc}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-3 font-semibold">Service & Endpoint</th>
              <th className="pb-3 font-semibold">Assigned Group / Cluster</th>
              <th className="pb-3 font-semibold">Latency</th>
              <th className="pb-3 font-semibold">Cost</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No API request logs match the selected search criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="transition-colors hover:bg-surface-muted/50">
                  <td className="py-4 font-mono text-body-xs">
                    <span className="font-semibold text-foreground block">{log.service}</span>
                    <span className="text-muted-foreground break-all">{log.endpoint}</span>
                  </td>
                  <td className="py-4">
                    {log.groupName ? (
                      <Badge variant="outline">{log.groupName}</Badge>
                    ) : (
                      <span className="text-body-xs text-muted-foreground">System Internal</span>
                    )}
                  </td>
                  <td className="py-4 font-medium text-foreground">{log.responseTimeMs} ms</td>
                  <td className="py-4 font-semibold text-foreground">
                    {log.costCents > 0 ? `${log.costCents}¢` : 'Free'}
                  </td>
                  <td className="py-4">
                    <Badge
                      variant={
                        log.httpStatus === 200
                          ? 'success'
                          : log.httpStatus === 429
                            ? 'warning'
                            : 'danger'
                      }
                    >
                      {log.httpStatus === 200
                        ? '200 OK'
                        : log.httpStatus === 429
                          ? '429 THROTTLED'
                          : `${log.httpStatus} ERROR`}
                    </Badge>
                  </td>
                  <td className="py-4 text-right text-body-xs text-muted-foreground font-medium">
                    {log.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
