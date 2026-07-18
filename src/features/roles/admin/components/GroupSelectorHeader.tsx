import { Badge } from '@/components/ui/badge';
import type { GroupAdminSummary } from '../admin.types';

interface GroupSelectorHeaderProps {
  groups: GroupAdminSummary[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
}

export function GroupSelectorHeader({
  groups,
  selectedGroupId,
  onSelectGroup,
}: GroupSelectorHeaderProps) {
  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  return (
    <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-surface to-card p-6 shadow-sm lg:flex-row lg:items-center">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-info/10 px-2.5 py-0.5 text-body-xs font-semibold uppercase tracking-wider text-info">
            Group Admin Portal
          </span>
          {currentGroup && (
            <>
              <Badge variant="primary">{currentGroup.myRole}</Badge>
              <Badge variant="neutral">{currentGroup.category}</Badge>
            </>
          )}
        </div>
        <h1 className="text-heading-xl font-bold tracking-tight text-foreground">
          {currentGroup ? currentGroup.name : 'Group Coordination & Oversight'}
        </h1>
        <p className="max-w-3xl text-body text-muted-foreground">
          Coordinate tracking policies, review pending member join requests, manage role hierarchy,
          and ensure road safety compliance across your assigned group clusters.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="group-select" className="text-body-xs font-semibold text-muted-foreground">
          Active Cluster:
        </label>
        <select
          id="group-select"
          value={selectedGroupId}
          onChange={(e) => onSelectGroup(e.target.value)}
          className="min-h-control rounded-md border border-input bg-surface px-3 py-2 text-body font-medium text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name} ({group.totalMembers} users)
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
