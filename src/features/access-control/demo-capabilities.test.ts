import { describe, expect, it } from 'vitest';

import { demoAccessProfiles } from './demo-access.profiles';
import { getDemoCapabilities, hasDemoCapability } from './demo-capabilities';

function profile(id: (typeof demoAccessProfiles)[number]['id']) {
  return demoAccessProfiles.find((item) => item.id === id)!;
}

describe('demo capabilities', () => {
  it('supports every approved demo profile', () => {
    for (const item of demoAccessProfiles) {
      expect(getDemoCapabilities(item)).toContain('view-dashboard');
      expect(getDemoCapabilities(item)).toContain('view-groups');
    }
  });

  it('keeps management actions away from Member and Group Guest', () => {
    expect(hasDemoCapability(profile('member'), 'manage-members')).toBe(false);
    expect(hasDemoCapability(profile('group-guest'), 'review-requests')).toBe(false);
    expect(hasDemoCapability(profile('group-guest'), 'read-only')).toBe(true);
  });

  it('uses the established safe defaults for map and trip previews', () => {
    expect(hasDemoCapability(profile('group-owner'), 'view-live-map')).toBe(true);
    expect(hasDemoCapability(profile('member'), 'view-trips')).toBe(true);
    expect(hasDemoCapability(profile('moderator'), 'view-live-map')).toBe(false);
    expect(hasDemoCapability(profile('group-guest'), 'view-trips')).toBe(false);
  });

  it('fails closed without a profile', () => {
    expect(getDemoCapabilities(null)).toEqual([]);
    expect(hasDemoCapability(null, 'view-dashboard')).toBe(false);
  });
});
