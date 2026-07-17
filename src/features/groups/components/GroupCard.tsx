import { Badge } from '@/components/ui/badge';

import type { Group } from '../groups.types';

interface GroupCardProps {
  group: Group;
  onClick?: () => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function GroupCard({ group, onClick }: GroupCardProps) {
  const statusVariant =
    group.status === 'active' ? 'success' : group.status === 'pending' ? 'warning' : 'danger';

  const statusLabel =
    group.status === 'active' ? 'Active' : group.status === 'pending' ? 'Pending' : 'Suspended';

  const visibilityLabel = group.visibility === 'public' ? 'Public' : 'Private';

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }

  return (
    <li
      className={`flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm ${
        onClick ? 'cursor-pointer hover:border-primary/40 hover:bg-muted/5 transition-all' : ''
      }`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? handleKeyDown : undefined}
      aria-label={`Group ${group.name}, click to view details`}
    >

      {/* Top row: Avatar + Name + Badges */}
      <div className="flex items-start gap-3">
        {/* Avatar initials */}
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-body-sm font-semibold text-primary-foreground"
          aria-hidden="true"
        >
          {group.initials}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body font-semibold text-foreground">{group.name}</h3>
          {group.category && <p className="text-body-xs text-muted-foreground">{group.category}</p>}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge variant={statusVariant} aria-label={`Status: ${statusLabel}`}>
            {statusLabel}
          </Badge>
          <Badge variant="outline" aria-label={`Visibility: ${visibilityLabel}`}>
            {visibilityLabel}
          </Badge>
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-2 text-body-sm text-muted-foreground">{group.description}</p>

      {/* Footer: member count + last updated */}
      <div className="flex items-center justify-between text-body-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{group.memberCount}</span>{' '}
          {group.memberCount === 1 ? 'member' : 'members'}
        </span>
        <span>Updated {formatDate(group.lastUpdated)}</span>
      </div>
    </li>
  );
}
