import { beforeEach, describe, expect, it } from 'vitest';

import { createPendingDemoAccessStore } from './demo-access-pending-store';

const storageKey = 'transport-management.demo-access-pending-profile';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('pending demo access store', () => {
  it('stores only an approved profile id', () => {
    const store = createPendingDemoAccessStore(window.sessionStorage);

    store.setProfileId('group-owner');

    expect(store.getProfileId()).toBe('group-owner');
    expect(window.sessionStorage.getItem(storageKey)).toBe(
      JSON.stringify({ profileId: 'group-owner' }),
    );
  });

  it('rejects malformed or unknown profile data safely', () => {
    const store = createPendingDemoAccessStore(window.sessionStorage);
    window.sessionStorage.setItem(storageKey, JSON.stringify({ profileId: 'not-a-profile' }));

    expect(store.getProfileId()).toBeNull();
    expect(window.sessionStorage.getItem(storageKey)).toBeNull();
  });

  it('clears a pending profile', () => {
    const store = createPendingDemoAccessStore(window.sessionStorage);
    store.setProfileId('member');

    store.clearProfile();

    expect(store.getProfileId()).toBeNull();
  });
});
