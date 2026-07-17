import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { Group } from '../groups.types';
import { GroupCard } from './GroupCard';

interface GroupListProps {
  groups: Group[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onGroupClick?: (group: Group) => void;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function EmptyState({
  hasActiveFilters,
  onClearFilters,
}: {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}) {
  if (hasActiveFilters) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card py-16 text-center"
        role="status"
      >
        <p className="text-body font-medium text-foreground">No groups match your filters</p>
        <p className="text-body-sm text-muted-foreground">
          Try adjusting your search or filter criteria.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card py-16 text-center"
      role="status"
    >
      <p className="text-body font-medium text-foreground">No groups available</p>
      <p className="text-body-sm text-muted-foreground">
        You have not joined or created any groups yet.
      </p>
      <Button disabled aria-label="Create group — coming soon">
        Create Group
      </Button>
    </div>
  );
}

export function GroupList({
  groups,
  onClearFilters,
  hasActiveFilters,
  onGroupClick,
}: GroupListProps) {
  if (groups.length === 0) {
    return <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} />;
  }

  return (
    <>
      {/* Mobile / Tablet: card list */}
      <ul className="flex flex-col gap-3 lg:hidden" aria-label="Groups list" role="list">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onClick={() => onGroupClick?.(group)} />
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden overflow-x-auto rounded-lg border border-border lg:block">
        <table className="w-full border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted">
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Group
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Visibility
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold text-muted-foreground">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-muted-foreground">
                Members
              </th>
              <th scope="col" className="px-4 py-3 text-right font-semibold text-muted-foreground">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => {
              const statusVariant =
                group.status === 'active'
                  ? 'success'
                  : group.status === 'pending'
                    ? 'warning'
                    : 'danger';

              const statusLabel =
                group.status === 'active'
                  ? 'Active'
                  : group.status === 'pending'
                    ? 'Pending'
                    : 'Suspended';

              const visibilityLabel = group.visibility === 'public' ? 'Public' : 'Private';

              function handleKeyDown(e: React.KeyboardEvent) {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onGroupClick?.(group);
                }
              }

              return (
                <tr
                  key={group.id}
                  className={`border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-muted/20 focus-within:bg-muted/20 ${
                    index % 2 === 0 ? 'bg-card' : 'bg-surface'
                  }`}
                  onClick={() => onGroupClick?.(group)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  aria-label={`Group ${group.name}, click to view details`}
                >
                  {/* Group name + description */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-body-xs font-semibold text-primary-foreground"
                        aria-hidden="true"
                      >
                        {group.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{group.name}</p>
                        <p className="truncate text-body-xs text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="px-4 py-3">
                    <Badge variant="outline">{visibilityLabel}</Badge>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>

                  {/* Members */}
                  <td className="px-4 py-3 text-right text-foreground">{group.memberCount}</td>

                  {/* Last updated */}
                  <td className="px-4 py-3 text-right text-muted-foreground">
                    {formatDate(group.lastUpdated)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

