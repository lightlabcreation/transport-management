import type { MemberStatus, TrackedMember } from '../live-map.types';

interface MemberListProps {
  members: TrackedMember[];
  selectedMemberId: string | null;
  onSelectMember: (member: TrackedMember) => void;
  onClearFilters: () => void;
}

const statusStyles: Record<MemberStatus, string> = {
  online: 'bg-success/10 text-success',
  stale: 'bg-warning/10 text-warning-foreground',
  offline: 'bg-surface-muted text-muted-foreground',
};

export function MemberList({
  members,
  selectedMemberId,
  onSelectMember,
  onClearFilters,
}: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="font-semibold">No members match your filters.</p>
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-3 min-h-control rounded-md px-3 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-focus-ring"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <ul className="grid gap-3" aria-label="Tracked members">
      {members.map((member) => {
        const isSelected = member.id === selectedMemberId;
        return (
          <li key={member.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectMember(member)}
              className={`w-full rounded-lg border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                isSelected ? 'border-primary bg-primary/5' : 'border-border bg-surface'
              }`}
            >
              <span className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                  {member.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{member.name}</span>
                    <span
                      className={`rounded-full px-2 py-1 text-body-sm ${statusStyles[member.status]}`}
                    >
                      {member.status}
                    </span>
                  </span>
                  <span className="mt-1 block text-body-sm text-muted-foreground">
                    {member.location} · {member.distance}
                  </span>
                  <span className="mt-2 block text-body-sm">
                    {member.speed === null ? 'Speed unavailable' : `${member.speed} km/h`} · Battery{' '}
                    {member.battery}% · {member.lastSeen}
                  </span>
                  {isSelected && (
                    <span className="mt-2 block text-body-sm font-semibold text-primary">
                      Selected
                    </span>
                  )}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
