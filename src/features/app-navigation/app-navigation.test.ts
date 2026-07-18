import { describe, expect, it } from 'vitest';

import { getApplicationNavigation } from './app-navigation';

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
});
