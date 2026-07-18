import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ModeratorPage() {
  const [broadcastNote, setBroadcastNote] = useState('');
  const [alertSent, setAlertSent] = useState(false);

  const activeDrivers = [
    { id: 'drv-1', name: 'Ramesh Driver (KA-01-EQ-9988)', speed: '64 km/h', limit: '80 km/h', status: 'Safe', zone: 'NH-48 Highway' },
    { id: 'drv-2', name: 'Suresh Kumar (KA-04-AB-1234)', speed: '94 km/h', limit: '80 km/h', status: 'Overspeeding', zone: 'NH-48 Highway Stretch' },
    { id: 'drv-3', name: 'Amitabh Verma (KA-02-XY-5544)', speed: '32 km/h', limit: '40 km/h', status: 'Safe', zone: 'City School Corridor' },
  ];

  const handleBroadcast = () => {
    if (!broadcastNote.trim()) return;
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      setBroadcastNote('');
    }, 4000);
  };

  return (
    <section aria-labelledby="moderator-title" className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-info/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-info">
              Fleet Supervision & Safety Desk
            </span>
            <Badge variant="primary">Moderator Access</Badge>
          </div>
          <h1 id="moderator-title" className="text-heading-xl font-bold tracking-tight text-foreground">
            Live Traffic Monitoring & Speed Violation Control
          </h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            Supervise assigned group drivers, track road speed limit infractions, monitor danger school zones, and broadcast immediate safety advisories (`M11`).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-heading-md font-semibold text-foreground">Live Driver Speed & Zone Status</h2>
            <Badge variant="warning">1 Active Alert</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 font-semibold">Participant / Vehicle</th>
                  <th className="pb-3 font-semibold">Speed vs Limit</th>
                  <th className="pb-3 font-semibold">Active Road Zone</th>
                  <th className="pb-3 font-semibold">Safety Status</th>
                  <th className="pb-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeDrivers.map((drv) => (
                  <tr key={drv.id} className="transition-colors hover:bg-surface-muted/50">
                    <td className="py-4 font-semibold text-foreground">{drv.name}</td>
                    <td className="py-4 font-mono">
                      <span className={drv.status === 'Overspeeding' ? 'font-bold text-danger' : 'text-foreground'}>
                        {drv.speed}
                      </span>{' '}
                      <span className="text-muted-foreground">/ {drv.limit}</span>
                    </td>
                    <td className="py-4 text-muted-foreground">{drv.zone}</td>
                    <td className="py-4">
                      <Badge variant={drv.status === 'Overspeeding' ? 'danger' : 'success'}>
                        {drv.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button size="sm" variant={drv.status === 'Overspeeding' ? 'danger' : 'outline'}>
                        {drv.status === 'Overspeeding' ? 'Warn Driver' : 'Ping'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-heading-md font-semibold text-foreground">Safety Broadcast Center</h2>
          <p className="text-body-sm text-muted-foreground">
            Send an instant voice-assisted or push advisory to all active drivers in your monitored cluster.
          </p>
          {alertSent && (
            <div role="status" className="rounded border border-success/30 bg-success/10 p-3 text-body-xs font-semibold text-success">
              Advisory broadcast sent to all drivers.
            </div>
          )}
          <div className="space-y-3">
            <Input
              placeholder="e.g. Heavy fog ahead on NH-48. Reduce speed below 60 km/h."
              value={broadcastNote}
              onChange={(e) => setBroadcastNote(e.target.value)}
            />
            <Button fullWidth onClick={handleBroadcast}>
              Send Safety Broadcast
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
