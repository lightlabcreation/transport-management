import type { OwnerPlatformStats } from '../owner.types';

interface PlatformStatsCardsProps {
  stats: OwnerPlatformStats;
}

export function PlatformStatsCards({ stats }: PlatformStatsCardsProps) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      trend: `+${stats.usersTrendPercent}% this month`,
      trendPositive: true,
      icon: (
        <svg
          className="size-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Active Tracking Groups',
      value: stats.activeGroups.toString(),
      trend: `+${stats.groupsTrendPercent}% active clusters`,
      trendPositive: true,
      icon: (
        <svg
          className="size-5 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
    {
      title: 'Pending Group Approvals',
      value: stats.pendingApprovals.toString(),
      trend: stats.pendingApprovals > 0 ? 'Requires immediate review' : 'All clear right now',
      trendPositive: stats.pendingApprovals === 0,
      icon: (
        <svg
          className="size-5 text-warning"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: 'Est. Monthly Revenue',
      value: stats.estimatedMonthlyRevenue,
      trend: `+${stats.revenueTrendPercent}% vs last billing cycle`,
      trendPositive: true,
      icon: (
        <svg
          className="size-5 text-info"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      role="region"
      aria-label="Platform Key Performance Indicators"
    >
      {cards.map((card) => (
        <div
          key={card.title}
          className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow duration-fast hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <p className="text-body-sm font-medium text-muted-foreground">{card.title}</p>
            <div className="flex size-9 items-center justify-center rounded-lg bg-surface-muted">
              {card.icon}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-heading-lg font-bold tracking-tight text-foreground">
              {card.value}
            </p>
          </div>
          <p
            className={`mt-2 text-body-xs font-medium ${
              card.trendPositive ? 'text-success' : 'text-warning'
            }`}
          >
            {card.trend}
          </p>
        </div>
      ))}
    </div>
  );
}
