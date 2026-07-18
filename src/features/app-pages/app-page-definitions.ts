import type { DemoCapability } from '@/features/access-control';

export const appPageDefinitions = [
  {
    id: 'navigation',
    path: '/app/navigation',
    title: 'Navigation',
    capability: 'view-navigation',
  },
  { id: 'trips', path: '/app/trips', title: 'Trips', capability: 'view-trips' },
  { id: 'alerts', path: '/app/alerts', title: 'Alerts', capability: 'view-alerts' },
  { id: 'reports', path: '/app/reports', title: 'Reports', capability: 'view-reports' },
] as const satisfies readonly {
  id: string;
  path: string;
  title: string;
  capability: DemoCapability;
}[];

export type AppPageDefinition = (typeof appPageDefinitions)[number];
