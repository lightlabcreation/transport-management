import type { ComponentType, SVGProps } from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>> | undefined;
  ariaLabel?: string | undefined;
  badge?: string | number | undefined;
}

export interface UserSummary {
  name: string;
  mobile: string;
  roleLabel?: string | undefined;
  avatarUrl?: string | undefined;
}

export interface ApplicationShellProps {
  navigationItems: NavigationItem[];
  currentPath: string;
  userSummary?: UserSummary | undefined;
  onLogout?: (() => void) | undefined;
  children: React.ReactNode;
}
