import type { ApplicationMode } from '@/features/application-mode';
import {
  hasDemoCapability,
  type DemoAccessProfile,
  type DemoCapability,
} from '@/features/access-control';
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

const navigationCapabilities: Record<string, DemoCapability> = {
  dashboard: 'view-dashboard',
  'live-map': 'view-live-map',
  groups: 'view-groups',
  speed: 'view-speed',
  'speed-dashboard': 'view-speed',
  navigation: 'view-navigation',
  trips: 'view-trips',
  alerts: 'view-alerts',
  notifications: 'view-notifications',
  reports: 'view-reports',
  profile: 'view-profile',
  settings: 'view-settings',
};

export function getApplicationNavigation(
  mode: ApplicationMode,
  profile: DemoAccessProfile | null = null,
): NavigationItem[] {
  const navigationItems = mode === 'tracking' ? trackingNavigationItems : speedNavigationItems;
  return navigationItems
    .filter((item) => {
      if (!profile) return true;
      const capability = navigationCapabilities[item.id];
      return capability ? hasDemoCapability(profile, capability) : false;
    })
    .map((item) => ({ ...item }));
}
