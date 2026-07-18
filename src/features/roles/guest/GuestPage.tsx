import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function GuestPage() {
  return (
    <section aria-labelledby="guest-title" className="space-y-6 pb-12">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm lg:flex-row lg:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-neutral/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Guest View-Only Preview
            </span>
            <Badge variant="outline">Limited Access</Badge>
          </div>
          <h1 id="guest-title" className="text-heading-xl font-bold tracking-tight text-foreground">
            Group Guest Preview & Join Status
          </h1>
          <p className="max-w-3xl text-body text-muted-foreground">
            You are currently exploring the cluster as a guest participant. Your GPS location is not being recorded or shared with the group (`M11`).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-heading-md font-semibold text-foreground">Pending Group Membership</h2>
          <p className="text-body-sm text-muted-foreground">
            Your request to join <strong>Express Logistics North Fleet</strong> has been submitted and is currently waiting for group administrator approval.
          </p>
          <div className="rounded border border-warning/30 bg-warning/10 p-4 space-y-2">
            <div className="flex items-center justify-between font-semibold text-body-sm text-foreground">
              <span>Status:</span>
              <Badge variant="warning">PENDING REVIEW</Badge>
            </div>
            <p className="text-body-xs text-muted-foreground">
              Once approved, you will gain full access to live member maps, speed alerts, and group navigation tools.
            </p>
          </div>
          <Button fullWidth variant="outline" size="sm" onClick={() => alert('Reminder ping sent to cluster admin.')}>
            🔔 Ping Admin for Review
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h2 className="text-heading-md font-semibold text-foreground">Why Join a Tracking Cluster?</h2>
          <ul className="space-y-2.5 text-body-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-success">✓</span>
              <span><strong>Live Map & ETA:</strong> See real-time positions of family, friends, or fleet vehicles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-success">✓</span>
              <span><strong>Road Speed Detection:</strong> Automatic TomTom overspeed warnings above road safety limits.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-success">✓</span>
              <span><strong>Instant Emergency SOS:</strong> 5-second trigger alerting all family & emergency contacts.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
