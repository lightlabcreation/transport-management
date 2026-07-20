import { Button } from '@/components/ui/button';

import type { TrackedMember } from '../live-map.types';

interface MemberDetailsProps {
  member: TrackedMember | null;
  onPreviewAction: (label: string) => void;
}

export function MemberDetails({ member, onPreviewAction }: MemberDetailsProps) {
  if (!member) {
    return (
      <section
        className="rounded-xl border border-dashed border-border bg-surface p-6"
        aria-label="Member details"
      >
        <h2 className="text-heading-sm font-semibold">Member details</h2>
        <p className="mt-2 text-body-sm text-muted-foreground">
          Select a map marker or member to inspect simulated tracking details.
        </p>
      </section>
    );
  }

  const details = [
    ['Status', member.status],
    ['Speed', member.speed === null ? 'Unavailable' : `${member.speed} km/h`],
    ['Battery', `${member.battery}%`],
    ['Distance', member.distance],
    ['Last seen', member.lastSeen],
  ];

  return (
    <section
      className="rounded-xl border border-border bg-surface p-5 shadow-sm"
      aria-label="Member details"
    >
      <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
        Selected member
      </p>
      <h2 className="mt-2 text-heading-sm font-semibold">{member.name}</h2>
      <p className="mt-1 text-body-sm text-muted-foreground">{member.location}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        {details.map(([label, value]) => (
          <div key={label} className="rounded-lg bg-surface-muted p-3">
            <dt className="text-body-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-semibold capitalize">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {['View details', 'Navigate', 'Call', 'Message', 'Block', 'Remove'].map((action) => (
          <Button
            key={action}
            variant={action === 'Block' || action === 'Remove' ? 'danger' : 'outline'}
            onClick={() => onPreviewAction(action)}
          >
            {action}
          </Button>
        ))}
      </div>
    </section>
  );
}
