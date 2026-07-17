import { describe, expect, it } from 'vitest';
import type { DemoAccessProfile } from '@/features/access-control';
import { getNavigationItems } from './navigation';

const mockGuestProfile: DemoAccessProfile = {
  id: 'group-guest',
  name: 'Group Guest',
  description: 'Guest profile',
};

const mockOwnerProfile: DemoAccessProfile = {
  id: 'group-owner',
  name: 'Group Owner',
  description: 'Owner profile',
};

describe('getNavigationItems helper', () => {
  it('returns all 11 items in tracking mode for Owner/Admin', () => {
    const ownerNav = getNavigationItems({
      profile: mockOwnerProfile,
      applicationMode: 'tracking',
    });
    expect(ownerNav).toHaveLength(11);
    expect(ownerNav.map((item) => item.id)).toEqual([
      'dashboard',
      'live-map',
      'groups',
      'speed',
      'navigation',
      'trips',
      'alerts',
      'notifications',
      'reports',
      'profile',
      'settings',
    ]);
  });

  it('returns 8 items in speed mode for Owner/Admin', () => {
    const ownerNav = getNavigationItems({
      profile: mockOwnerProfile,
      applicationMode: 'speed',
    });
    expect(ownerNav).toHaveLength(8);
    expect(ownerNav.map((item) => item.id)).toEqual([
      'dashboard',
      'speed',
      'navigation',
      'trips',
      'alerts',
      'reports',
      'profile',
      'settings',
    ]);
  });

  it('filters to limited 4 items in tracking mode for Guest', () => {
    const guestNav = getNavigationItems({
      profile: mockGuestProfile,
      applicationMode: 'tracking',
    });
    expect(guestNav).toHaveLength(4);
    expect(guestNav.map((item) => item.id)).toEqual(['dashboard', 'groups', 'profile', 'settings']);
  });

  it('filters to limited 3 items in speed mode for Guest', () => {
    const guestNav = getNavigationItems({
      profile: mockGuestProfile,
      applicationMode: 'speed',
    });
    expect(guestNav).toHaveLength(3);
    expect(guestNav.map((item) => item.id)).toEqual(['dashboard', 'profile', 'settings']);
  });
});
