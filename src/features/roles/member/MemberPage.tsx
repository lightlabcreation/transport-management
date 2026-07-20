import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function MemberPage() {
  const [sharingLocation, setSharingLocation] = useState(true);
  const [batteryOptimization, setBatteryOptimization] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const toggleLocation = () => {
    setSharingLocation(!sharingLocation);
    setStatusMsg(!sharingLocation ? 'Live tracking resumed.' : 'Location sharing paused (Optional Mode).');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <section aria-labelledby="member-title" className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-success">
              Personal Tracking Workspace
            </span>
            <Badge variant={sharingLocation ? 'success' : 'neutral'}>
              {sharingLocation ? 'BROADCASTING LIVE' : 'PAUSED'}
            </Badge>
          </div>
          <h1 id="member-title" className="text-heading-xl font-bold tracking-tight text-foreground">
            Group Member Telemetry & Privacy Portal
          </h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            Manage your personal live coordinates, optimize battery drain during long commutes, check current road speed limits, and access emergency contacts (`M11`).
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant={sharingLocation ? 'outline' : 'primary'}
            size="sm"
            onClick={toggleLocation}
          >
            {sharingLocation ? '⏸️ Pause Tracking' : '▶️ Resume Live Tracking'}
          </Button>
        </div>
      </div>

      {statusMsg && (
        <div role="status" className="rounded-lg border border-info/30 bg-info/10 p-4 text-body-sm font-semibold text-info">
          {statusMsg}
        </div>
      )}

      {/* Member Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger/20 text-xl">
              🚨
            </div>
            <div>
              <h3 className="font-semibold text-danger">SOS Emergency</h3>
              <p className="text-body-sm text-danger/80">Trigger fleet alerts</p>
            </div>
          </div>
          <Button
            variant="danger"
            className="mt-4 w-full bg-danger text-danger-foreground hover:bg-danger/90"
            onClick={() => window.location.assign('/app/sos')}
          >
            Open SOS Panel
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success/10 text-xl">
              💬
            </div>
            <div>
              <h3 className="font-semibold text-foreground">WhatsApp Hub</h3>
              <p className="text-body-sm text-muted-foreground">Join groups instantly</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => window.location.assign('/app/whatsapp-invites')}
          >
            View Invitations
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-heading-md font-semibold text-foreground">Current GPS Status</h2>
          <div className="space-y-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assigned Cluster</span>
              <span className="font-semibold text-foreground">Express Logistics Fleet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Speed</span>
              <span className="font-semibold text-success">45 km/h (Limit: 80 km/h)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GPS Accuracy</span>
              <span className="font-semibold text-foreground">±3.2 meters (High)</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-heading-md font-semibold text-foreground">Battery Health & Optimizer</h2>
          <div className="space-y-2 text-body-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Device Battery</span>
              <span className="font-semibold text-foreground">🔋 88% (Est. 14 hrs left)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Background Polling</span>
              <span className="font-semibold text-foreground">{batteryOptimization ? 'Every 30s (Eco)' : 'Continuous (5s)'}</span>
            </div>
          </div>
          <Button
            fullWidth
            size="sm"
            variant={batteryOptimization ? 'primary' : 'outline'}
            onClick={() => setBatteryOptimization(!batteryOptimization)}
          >
            {batteryOptimization ? 'Disable Eco Mode' : 'Enable Battery Eco Mode'}
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-heading-md font-semibold text-foreground">Safety Quick Shortcuts</h2>
          <p className="text-body-xs text-muted-foreground">
            Instantly alert cluster moderators and family contacts if you encounter a road hazard.
          </p>
          <div className="space-y-2 pt-1">
            <Button fullWidth variant="danger" size="sm" onClick={() => alert('SOS Trigger activated. Broadcast sent to cluster admins.')}>
              🚨 Trigger Emergency SOS
            </Button>
            <Button fullWidth variant="outline" size="sm">
              💬 Open Cluster Group Chat
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
