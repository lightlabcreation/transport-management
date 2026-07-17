import type { ApplicationMode } from '@/features/application-mode';
import type { NavigationItem } from '@/features/shell';

const sharedNavigationItems: readonly NavigationItem[] = [
  {
    id: 'navigation',
    label: 'Navigation',
    href: '/app/navigation',
    ariaLabel: 'Navigation',
  },
  { id: 'trips', label: 'Trips', href: '/app/trips', ariaLabel: 'Trips' },
  { id: 'alerts', label: 'Alerts', href: '/app/alerts', ariaLabel: 'Alerts' },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/app/notifications',
    ariaLabel: 'Notifications',
  },
  { id: 'reports', label: 'Reports', href: '/app/reports', ariaLabel: 'Reports' },
  { id: 'profile', label: 'Profile', href: '/app/profile', ariaLabel: 'Profile' },
  { id: 'settings', label: 'Settings', href: '/app/settings', ariaLabel: 'Settings' },
];

const trackingNavigationItems: readonly NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/app/dashboard',
    ariaLabel: 'Dashboard',
  },
  { id: 'live-map', label: 'Live Map', href: '/app/live-map', ariaLabel: 'Live Map' },
  { id: 'groups', label: 'Groups', href: '/app/groups', ariaLabel: 'Groups' },
  { id: 'speed', label: 'Speed', href: '/app/speed', ariaLabel: 'Speed' },
  ...sharedNavigationItems,
];

const speedNavigationItems: readonly NavigationItem[] = [
  {
    id: 'speed-dashboard',
    label: 'Speed Dashboard',
    href: '/app/speed',
    ariaLabel: 'Speed Dashboard',
  },
  ...sharedNavigationItems,
];

export function getApplicationNavigation(mode: ApplicationMode): NavigationItem[] {
  const navigationItems = mode === 'tracking' ? trackingNavigationItems : speedNavigationItems;
  return navigationItems.map((item) => ({ ...item }));
}
