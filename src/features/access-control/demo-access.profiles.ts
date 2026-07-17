import type { DemoAccessProfile } from './demo-access.types';

export const demoAccessProfiles: readonly DemoAccessProfile[] = [
  {
    id: 'group-owner',
    name: 'Group Owner',
    description: 'Preview the group creator experience and its complete management surface.',
  },
  {
    id: 'delegated-group-administrator',
    name: 'Delegated Group Administrator',
    description:
      'Preview administration with an explicitly delegated set of group responsibilities.',
  },
  {
    id: 'group-admin',
    name: 'Group Admin',
    description: 'Preview day-to-day group operations and permitted member coordination.',
  },
  {
    id: 'moderator',
    name: 'Moderator',
    description: 'Preview limited membership, request, content, and safety operations.',
  },
  {
    id: 'member',
    name: 'Member',
    description: 'Preview the standard participant experience for tracking and group activity.',
  },
  {
    id: 'group-guest',
    name: 'Group Guest',
    description: 'Preview a restricted, temporary, and primarily read-only group experience.',
  },
];

export function findDemoAccessProfile(id: unknown) {
  return demoAccessProfiles.find((profile) => profile.id === id) ?? null;
}
