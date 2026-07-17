import type { DemoAccessProfile } from '@/features/access-control';
import type { ApplicationMode } from '@/features/application-mode';
import type { NavigationItem } from './shell.types';

interface GetNavigationItemsArgs {
  profile: DemoAccessProfile | null;
  applicationMode: ApplicationMode | null;
}

export function getNavigationItems({
  profile,
  applicationMode,
}: GetNavigationItemsArgs): NavigationItem[] {
  const profileId = profile?.id;

  if (applicationMode === 'speed') {
    const speedItems: NavigationItem[] = [
      { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', ariaLabel: 'Dashboard' },
      { id: 'speed', label: 'Speed', href: '/app/speed', ariaLabel: 'Speed' },
      { id: 'navigation', label: 'Navigation', href: '/app/navigation', ariaLabel: 'Navigation' },
      { id: 'trips', label: 'Trips', href: '/app/trips', ariaLabel: 'Trips' },
      { id: 'alerts', label: 'Alerts', href: '/app/alerts', ariaLabel: 'Alerts' },
      { id: 'reports', label: 'Reports', href: '/app/reports', ariaLabel: 'Reports' },
      { id: 'profile', label: 'Profile', href: '/app/profile', ariaLabel: 'Profile' },
      { id: 'settings', label: 'Settings', href: '/app/settings', ariaLabel: 'Settings' },
    ];

    if (profileId === 'group-guest') {
      return speedItems.filter((item) => ['dashboard', 'profile', 'settings'].includes(item.id));
    }

    return speedItems;
  }

  // Tracking Mode (or default)
  const trackingItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', ariaLabel: 'Dashboard' },
    { id: 'live-map', label: 'Live Map', href: '/app/live-map', ariaLabel: 'Live Map' },
    { id: 'groups', label: 'Groups', href: '/app/groups', ariaLabel: 'Groups' },
    { id: 'speed', label: 'Speed', href: '/app/speed', ariaLabel: 'Speed' },
    { id: 'navigation', label: 'Navigation', href: '/app/navigation', ariaLabel: 'Navigation' },
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

  if (profileId === 'group-guest') {
    return trackingItems.filter((item) =>
      ['dashboard', 'groups', 'profile', 'settings'].includes(item.id),
    );
  }

  return trackingItems;
}
