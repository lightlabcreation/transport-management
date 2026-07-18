import type { DemoAccessProfile, DemoAccessProfileId } from './demo-access.types';

export type DemoCapability =
  | 'view-dashboard'
  | 'view-live-map'
  | 'view-groups'
  | 'view-speed'
  | 'view-navigation'
  | 'view-trips'
  | 'view-alerts'
  | 'view-notifications'
  | 'view-reports'
  | 'view-profile'
  | 'view-settings'
  | 'manage-members'
  | 'review-requests'
  | 'read-only';

const sharedCapabilities: readonly DemoCapability[] = [
  'view-dashboard',
  'view-groups',
  'view-speed',
  'view-navigation',
  'view-alerts',
  'view-notifications',
  'view-profile',
  'view-settings',
];

const profileCapabilities: Record<DemoAccessProfileId, readonly DemoCapability[]> = {
  'group-owner': [
    ...sharedCapabilities,
    'view-live-map',
    'view-trips',
    'view-reports',
    'manage-members',
    'review-requests',
  ],
  'delegated-group-administrator': [
    ...sharedCapabilities,
    'view-live-map',
    'view-trips',
    'view-reports',
    'manage-members',
    'review-requests',
  ],
  'group-admin': [
    ...sharedCapabilities,
    'view-live-map',
    'view-trips',
    'view-reports',
    'manage-members',
    'review-requests',
  ],
  moderator: [...sharedCapabilities, 'view-reports', 'review-requests'],
  member: [...sharedCapabilities, 'view-live-map', 'view-trips', 'view-reports'],
  'group-guest': [...sharedCapabilities, 'read-only'],
};

export function getDemoCapabilities(profile: DemoAccessProfile | null): readonly DemoCapability[] {
  return profile ? profileCapabilities[profile.id] : [];
}

export function hasDemoCapability(profile: DemoAccessProfile | null, capability: DemoCapability) {
  return getDemoCapabilities(profile).includes(capability);
}
