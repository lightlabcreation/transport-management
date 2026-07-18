import type { DemoAccessProfile } from './demo-access.types';

export const demoAccessProfiles: readonly DemoAccessProfile[] = [
  {
    id: 'group-owner',
    name: 'Platform Owner',
    description: 'Master platform management and complete group control.',
  },
  {
    id: 'delegated-group-administrator',
    name: 'Admin Assistant',
    description: 'Assisted administration with delegated group permissions.',
  },
  {
    id: 'group-admin',
    name: 'Fleet Admin',
    description: 'Day-to-day group operations and cluster coordination.',
  },
  {
    id: 'moderator',
    name: 'Safety Moderator',
    description: 'Speed violation monitoring and road safety checks.',
  },
  {
    id: 'member',
    name: 'Active Driver',
    description: 'Live GPS telemetry tracking and emergency controls.',
  },
  {
    id: 'group-guest',
    name: 'Guest Viewer',
    description: 'Restricted, temporary, and read-only map preview.',
  },
];

export function findDemoAccessProfile(id: unknown) {
  return demoAccessProfiles.find((profile) => profile.id === id) ?? null;
}
