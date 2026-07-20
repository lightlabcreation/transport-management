import { createElement, type ComponentType, type SVGProps } from 'react';
import type { ApplicationMode } from '@/features/application-mode';
import {
  hasDemoCapability,
  type DemoAccessProfile,
  type DemoCapability,
} from '@/features/access-control';
import type { NavigationItem } from '@/features/shell';

// Helper to create pure TS SVG icon components without JSX
function createIcon(pathD: string | string[]): ComponentType<SVGProps<SVGSVGElement>> {
  const paths = Array.isArray(pathD) ? pathD : [pathD];
  return (props) =>
    createElement(
      'svg',
      { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', ...props },
      ...paths.map((d, i) =>
        createElement('path', {
          key: i,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          strokeWidth: 2,
          d,
        }),
      ),
    );
}

// --- High fidelity icon components ---
const DashboardIcon = createIcon([
  'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
]);
const LiveMapIcon = createIcon([
  'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z',
  'M15 11a3 3 0 11-6 0 3 3 0 016 0z',
]);
const GroupsIcon = createIcon([
  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
]);
const SpeedIcon = createIcon(['M13 10V3L4 14h7v7l9-11h-7z']);
const PaymentsIcon = createIcon([
  'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
]);
const WhatsAppIcon = createIcon([
  'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
]);
const ApiCostsIcon = createIcon([
  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
]);
const NavigationIcon = createIcon(['M12 19l9 2-9-18-9 18 9-2zm0 0v-8']);
const TripsIcon = createIcon([
  'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
]);
const AlertsIcon = createIcon([
  'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
]);
const NotificationsIcon = createIcon([
  'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
]);
const ReportsIcon = createIcon([
  'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
]);
const SosIcon = createIcon([
  'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
]);
const ProfileIcon = createIcon([
  'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
]);
const SettingsIcon = createIcon([
  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
]);

const sharedNavigationItems: readonly NavigationItem[] = [
  { id: 'navigation', label: 'Navigation', href: '/app/navigation', ariaLabel: 'Navigation', icon: NavigationIcon },
  { id: 'trips', label: 'Trips', href: '/app/trips', ariaLabel: 'Trips', icon: TripsIcon },
  { id: 'alerts', label: 'Alerts', href: '/app/alerts', ariaLabel: 'Alerts', icon: AlertsIcon },
  { id: 'notifications', label: 'Notifications', href: '/app/notifications', ariaLabel: 'Notifications', icon: NotificationsIcon },
  { id: 'reports', label: 'Reports', href: '/app/reports', ariaLabel: 'Reports', icon: ReportsIcon },
  { id: 'sos', label: 'SOS Safety', href: '/app/sos', ariaLabel: 'SOS Safety Center', icon: SosIcon },
  { id: 'profile', label: 'Profile', href: '/app/profile', ariaLabel: 'Profile', icon: ProfileIcon },
  { id: 'settings', label: 'Settings', href: '/app/settings', ariaLabel: 'Settings', icon: SettingsIcon },
];

const trackingNavigationItems: readonly NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/app/dashboard', ariaLabel: 'Dashboard', icon: DashboardIcon },
  { id: 'live-map', label: 'Live Map', href: '/app/live-map', ariaLabel: 'Live Map', icon: LiveMapIcon },
  { id: 'groups', label: 'Groups', href: '/app/groups', ariaLabel: 'Groups', icon: GroupsIcon },
  { id: 'speed', label: 'Speed', href: '/app/speed', ariaLabel: 'Speed', icon: SpeedIcon },
  { id: 'payments', label: 'Payments', href: '/app/payments', ariaLabel: 'Payments & Billing', icon: PaymentsIcon },
  { id: 'whatsapp-invites', label: 'WhatsApp', href: '/app/whatsapp-invites', ariaLabel: 'WhatsApp Invites', icon: WhatsAppIcon },
  { id: 'cost-monitoring', label: 'API Costs', href: '/app/cost-monitoring', ariaLabel: 'API Cost Monitoring', icon: ApiCostsIcon },
  ...sharedNavigationItems,
];

const speedNavigationItems: readonly NavigationItem[] = [
  { id: 'speed-dashboard', label: 'Speed Dashboard', href: '/app/speed', ariaLabel: 'Speed Dashboard', icon: SpeedIcon },
  { id: 'sos', label: 'SOS Safety', href: '/app/sos', ariaLabel: 'SOS Safety Center', icon: SosIcon },
  ...sharedNavigationItems.filter((i) => i.id !== 'sos'),
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
  sos: 'view-sos',
  payments: 'view-payments',
  'whatsapp-invites': 'view-whatsapp-invites',
  'cost-monitoring': 'view-cost-monitoring',
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
