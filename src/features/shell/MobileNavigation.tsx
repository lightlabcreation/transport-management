import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import type { NavigationItem, UserSummary } from './shell.types';

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  currentPath: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  userSummary?: UserSummary | undefined;
  onLogout?: (() => void) | undefined;
}

export function MobileNavigation({
  navigationItems,
  currentPath,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  userSummary,
  onLogout,
}: MobileNavigationProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Focus trap and accessibility helpers
  useEffect(() => {
    if (isMenuOpen) {
      // Focus first element in drawer
      const focusableElements = drawerRef.current?.querySelectorAll('button, a, [tabindex="0"]');
      if (focusableElements && focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCloseMenu();
          triggerRef.current?.focus();
        }

        if (e.key === 'Tab' && drawerRef.current) {
          const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
            'button, a, [tabindex="0"]',
          );
          if (focusable.length === 0) return;

          const firstEl = focusable[0];
          const lastEl = focusable[focusable.length - 1];

          if (!firstEl || !lastEl) return;

          if (e.shiftKey) {
            if (document.activeElement === firstEl) {
              lastEl.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastEl) {
              firstEl.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMenuOpen, onCloseMenu]);

  // Bottom navigation primary items (first 4 items)
  const bottomNavItems = navigationItems.slice(0, 4);

  return (
    <>
      {/* 1. Bottom Navigation Bar (Visible on mobile/tablet only) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-sticky h-16 border-t border-border bg-surface px-4 pb-safe shadow-md"
        aria-label="Mobile Bottom Navigation"
      >
        <ul className="flex h-full items-center justify-around">
          {bottomNavItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <li key={item.id} className="flex-1">
                <Link
                  to={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.ariaLabel}
                  onClick={onCloseMenu}
                  className={`flex flex-col items-center justify-center h-full gap-1 text-center rounded-md py-1 transition-colors focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 ${
                    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="relative">
                    {Icon ? (
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-border" />
                    )}
                    {item.badge !== undefined && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium truncate max-w-[70px]">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Menu / More toggle option in Bottom Bar */}
          <li className="flex-1">
            <button
              ref={triggerRef}
              onClick={onToggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={isMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
              className={`flex flex-col items-center justify-center h-full w-full gap-1 text-center rounded-md py-1 transition-colors focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 ${
                isMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
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
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <span className="text-[10px] font-medium">Menu</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* 2. Slide-out Navigation Drawer Overlay (Visible on mobile/tablet when open) */}
      <div
        id="mobile-navigation-drawer"
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        className={`lg:hidden fixed inset-0 z-overlay transition-opacity duration-normal ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          onClick={onCloseMenu}
          className="absolute inset-0 bg-overlay backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <div
          ref={drawerRef}
          className={`absolute inset-y-0 left-0 flex w-full max-w-xs flex-col bg-surface border-r border-border shadow-lg transition-transform duration-normal transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex h-16 items-center justify-between border-b border-border px-page shrink-0">
            <span className="text-body font-bold text-foreground">Menu Navigation</span>
            <button
              onClick={onCloseMenu}
              aria-label="Close menu drawer"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Full Navigation list inside Drawer */}
          <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Mobile Drawer Navigation">
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
                      onClick={onCloseMenu}
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
                        <span className="truncate max-w-[160px]">{item.label}</span>
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

          {/* User profile & logout footer inside Drawer */}
          <div className="border-t border-border p-4 bg-surface-muted shrink-0">
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
                onClick={() => {
                  onCloseMenu();
                  onLogout();
                }}
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
        </div>
      </div>
    </>
  );
}
