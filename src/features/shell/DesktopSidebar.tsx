import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import type { NavigationItem, UserSummary } from './shell.types';

interface DesktopSidebarProps {
  navigationItems: NavigationItem[];
  currentPath: string;
  userSummary?: UserSummary | undefined;
  onLogout?: (() => void) | undefined;
}

export function DesktopSidebar({
  navigationItems,
  currentPath,
  userSummary,
  onLogout,
}: DesktopSidebarProps) {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-surface h-screen sticky top-0">
      {/* Brand logo/section */}
      <div className="flex h-16 items-center border-b border-border px-page">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
        >
          {/* Logo SVG */}
          <svg
            className="h-6 w-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17h2m10 0h2"
            />
          </svg>
          <span className="text-body font-bold tracking-tight text-foreground">
            Kiyaan Transport
          </span>
        </Link>
      </div>

      {/* Navigation items list */}
      <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Desktop Navigation">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.ariaLabel}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-body-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-surface-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon ? (
                      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-border" />
                    )}
                    <span className="truncate max-w-[140px]" title={item.label}>
                      {item.label}
                    </span>
                  </div>
                  {item.badge !== undefined && (
                    <Badge
                      variant={isActive ? 'outline' : 'neutral'}
                      className="ml-auto font-semibold"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User profile & logout controls footer */}
      <div className="border-t border-border p-4 bg-surface">
        {userSummary && (
          <div className="flex items-center gap-3 mb-4 px-2">
            {userSummary.avatarUrl ? (
              <img
                src={userSummary.avatarUrl}
                alt={`${userSummary.name} avatar`}
                className="h-10 w-10 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-primary text-body-sm font-semibold text-primary-foreground">
                {userSummary.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span
                className="text-body-sm font-medium text-foreground truncate"
                title={userSummary.name}
              >
                {userSummary.name}
              </span>
              <span
                className="text-body-xs text-muted-foreground truncate"
                title={userSummary.roleLabel || userSummary.mobile}
              >
                {userSummary.roleLabel || userSummary.mobile}
              </span>
            </div>
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            aria-label="Log out of application"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-body-sm font-medium text-muted-foreground hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Log out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
