import { useState } from 'react';
import type { UserSummary } from './shell.types';
import { SettingsDrawer } from './SettingsDrawer';

interface ShellHeaderProps {
  pageTitle?: string | undefined;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onLogout?: (() => void) | undefined;
  userSummary?: UserSummary | undefined;
}

export function ShellHeader({
  pageTitle = 'Transport Management',
  isMenuOpen,
  onToggleMenu,
  onLogout,
  userSummary,
}: ShellHeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-sticky flex h-[var(--spacing-control)] items-center justify-between border-b border-border bg-surface px-page shadow-sm md:h-16">
      {/* Left side: Menu toggle (mobile/tablet) & title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 lg:hidden"
        >
          {isMenuOpen ? (
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
          ) : (
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        <h1 className="text-body font-semibold text-foreground md:text-heading-sm">{pageTitle}</h1>
      </div>

      {/* Right side: Settings (⚙️), User summary & Log out button */}
      <div className="flex items-center gap-3">
        {/* Client Top-Right Settings ⚙️ Icon Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open Settings Menu"
          title="Settings & Service Registration"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface text-foreground hover:bg-surface-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {userSummary && (
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex flex-col text-right">
              <span className="text-body-sm font-medium text-foreground">{userSummary.name}</span>
              {userSummary.roleLabel && (
                <span className="text-body-xs text-muted-foreground">{userSummary.roleLabel}</span>
              )}
            </div>
            {userSummary.avatarUrl ? (
              <img
                src={userSummary.avatarUrl}
                alt={`${userSummary.name} avatar`}
                className="h-9 w-9 rounded-full border border-border object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-primary text-body-sm font-semibold text-primary-foreground">
                {userSummary.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}

        {onLogout && (
          <button
            onClick={onLogout}
            aria-label="Log out"
            className="flex h-10 px-3 items-center justify-center gap-2 rounded-md border border-border bg-surface text-body-sm font-medium text-foreground hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2"
          >
            <span className="hidden sm:inline">Log out</span>
            <svg
              className="h-5 w-5 text-muted-foreground"
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
          </button>
        )}

        {/* Settings Drawer Component */}
        <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </div>
    </header>
  );
}

