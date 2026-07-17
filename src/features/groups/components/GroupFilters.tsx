import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { GroupFiltersState, StatusFilter, VisibilityFilter } from '../groups.types';

interface GroupFiltersProps {
  filters: GroupFiltersState;
  onSearchChange: (value: string) => void;
  onVisibilityChange: (value: VisibilityFilter) => void;
  onStatusChange: (value: StatusFilter) => void;
  onClearFilters: () => void;
  resultCount: number;
}

export function GroupFilters({
  filters,
  onSearchChange,
  onVisibilityChange,
  onStatusChange,
  onClearFilters,
  resultCount,
}: GroupFiltersProps) {
  const hasActiveFilters =
    filters.search !== '' || filters.visibility !== 'all' || filters.status !== 'all';

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        {/* Search */}
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="group-search" className="text-body-sm font-medium text-foreground">
            Search groups
          </label>
          <Input
            id="group-search"
            type="search"
            placeholder="Search by group name…"
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search groups by name"
          />
        </div>

        {/* Visibility filter */}
        <div className="flex flex-col gap-1">
          <label htmlFor="visibility-filter" className="text-body-sm font-medium text-foreground">
            Visibility
          </label>
          <select
            id="visibility-filter"
            value={filters.visibility}
            onChange={(e) => onVisibilityChange(e.target.value as VisibilityFilter)}
            className="min-h-control rounded-md border border-input bg-surface px-3 py-2 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            aria-label="Filter by visibility"
          >
            <option value="all">All visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex flex-col gap-1">
          <label htmlFor="status-filter" className="text-body-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
            className="min-h-control rounded-md border border-input bg-surface px-3 py-2 text-body text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            aria-label="Filter by status"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} aria-label="Clear all filters">
            Clear Filters
          </Button>
        )}
      </div>

      {/* Result count */}
      <p className="text-body-sm text-muted-foreground" role="status" aria-live="polite">
        {resultCount === 1 ? '1 group found' : `${resultCount} groups found`}
      </p>
    </div>
  );
}
