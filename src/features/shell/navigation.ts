import type { NavigationItem } from './shell.types';

export const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', ariaLabel: 'Dashboard' },
  { id: 'live-map', label: 'Live Map', href: '/app/live-map', ariaLabel: 'Live Map' },
  { id: 'groups', label: 'Groups', href: '/app/groups', ariaLabel: 'Groups' },
];
