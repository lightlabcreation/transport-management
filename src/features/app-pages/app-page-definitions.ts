export const appPageDefinitions = [
  { id: 'speed', path: '/app/speed', title: 'Speed' },
  { id: 'navigation', path: '/app/navigation', title: 'Navigation' },
  { id: 'trips', path: '/app/trips', title: 'Trips' },
  { id: 'alerts', path: '/app/alerts', title: 'Alerts' },
  { id: 'notifications', path: '/app/notifications', title: 'Notifications' },
  { id: 'reports', path: '/app/reports', title: 'Reports' },
  { id: 'profile', path: '/app/profile', title: 'Profile' },
  { id: 'settings', path: '/app/settings', title: 'Settings' },
] as const;

export type AppPageDefinition = (typeof appPageDefinitions)[number];
