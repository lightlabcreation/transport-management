import { describe, expect, it } from 'vitest';

import { demoAccessProfiles } from '@/features/access-control';

import { getApplicationNavigation } from './app-navigation';

function profile(id: (typeof demoAccessProfiles)[number]['id']) {
  return demoAccessProfiles.find((item) => item.id === id)!;
}

describe('application navigation', () => {
  it('returns the complete tracking-mode navigation in its approved order', () => {
    expect(getApplicationNavigation('tracking').map(({ label }) => label)).toEqual([
      'Dashboard',
      'Live Map',
      'Groups',
      'Speed',
      'Navigation',
      'Trips',
      'Alerts',
      'Notifications',
      'Reports',
      'Profile',
      'Settings',
    ]);
  });

  it('returns the approved speed-mode navigation', () => {
    expect(getApplicationNavigation('speed').map(({ label }) => label)).toEqual([
      'Speed Dashboard',
      'Navigation',
      'Trips',
      'Alerts',
      'Notifications',
      'Reports',
      'Profile',
      'Settings',
    ]);
  });

  it('does not expose group or member-tracking destinations in speed mode', () => {
    const speedNavigation = getApplicationNavigation('speed');

    expect(speedNavigation).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/app/live-map' }),
        expect.objectContaining({ href: '/app/groups' }),
      ]),
    );
    expect(speedNavigation.map(({ label }) => label).join(' ')).not.toMatch(/member tracking/i);
  });

  it.each(['tracking', 'speed'] as const)('includes Notifications in %s mode', (mode) => {
    expect(getApplicationNavigation(mode)).toEqual(
      expect.arrayContaining([expect.objectContaining({ href: '/app/notifications' })]),
    );
  });

  it('returns a new collection so consumers cannot mutate the shared registry', () => {
    const firstResult = getApplicationNavigation('tracking');
    firstResult[0]!.label = 'Changed';

    expect(getApplicationNavigation('tracking')[0]?.label).toBe('Dashboard');
  });

  it('filters policy-dependent destinations through the selected demo profile', () => {
    const moderatorNavigation = getApplicationNavigation('tracking', profile('moderator'));

    expect(moderatorNavigation.map(({ label }) => label)).not.toContain('Live Map');
    expect(moderatorNavigation.map(({ label }) => label)).not.toContain('Trips');
    expect(moderatorNavigation.map(({ label }) => label)).toContain('Reports');
  });

  it('keeps Group Guest navigation read-only and limited', () => {
    const guestNavigation = getApplicationNavigation('tracking', profile('group-guest'));

    expect(guestNavigation.map(({ label }) => label)).toEqual([
      'Dashboard',
      'Groups',
      'Speed',
      'Navigation',
      'Alerts',
      'Notifications',
      'Profile',
      'Settings',
    ]);
  });
});
