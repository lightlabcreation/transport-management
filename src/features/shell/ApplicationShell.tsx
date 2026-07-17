import { useState } from 'react';
import { ShellHeader } from './ShellHeader';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavigation } from './MobileNavigation';
import type { ApplicationShellProps } from './shell.types';

export function ApplicationShell({
  navigationItems,
  currentPath,
  userSummary,
  onLogout,
  children,
}: ApplicationShellProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derive the active page title based on current path
  const activeNavItem = navigationItems.find((item) => item.href === currentPath);
  const pageTitle = activeNavItem ? activeNavItem.label : 'Transport Management';

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground select-none">
      {/* 1. Desktop Sidebar Navigation (Visible on screen width >= 1024px) */}
      <DesktopSidebar
        navigationItems={navigationItems}
        currentPath={currentPath}
        userSummary={userSummary}
        onLogout={onLogout}
      />

      {/* 2. Main Area (Header + Main Page Content) */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <ShellHeader
          pageTitle={pageTitle}
          isMenuOpen={isMenuOpen}
          onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
          onLogout={onLogout}
          userSummary={userSummary}
        />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-page pb-24 lg:pb-page focus:outline-none">
          <div className="mx-auto w-full max-w-content animate-fade-in">{children}</div>
        </main>
      </div>

      {/* 3. Mobile Navigation layer (Bottom Bar + Side Drawer) */}
      <MobileNavigation
        navigationItems={navigationItems}
        currentPath={currentPath}
        isMenuOpen={isMenuOpen}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onCloseMenu={() => setIsMenuOpen(false)}
        userSummary={userSummary}
        onLogout={onLogout}
      />
    </div>
  );
}
