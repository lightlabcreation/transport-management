import { beforeEach, describe, expect, it } from 'vitest';

import { createApplicationModeStore } from './application-mode-store';

const storageKey = 'transport-management.application-mode';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('application mode store', () => {
  it.each(['tracking', 'speed'] as const)('persists the %s mode', (mode) => {
    const store = createApplicationModeStore(window.sessionStorage);

    store.setMode(mode);

    expect(store.getMode()).toBe(mode);
    expect(window.sessionStorage.getItem(storageKey)).toBe(JSON.stringify({ mode }));
  });

  it('restores a selected mode through a new store instance', () => {
    createApplicationModeStore(window.sessionStorage).setMode('tracking');

    const restoredStore = createApplicationModeStore(window.sessionStorage);

    expect(restoredStore.getMode()).toBe('tracking');
  });

  it.each(['{invalid', JSON.stringify({ mode: 'unknown' }), JSON.stringify(['tracking'])])(
    'fails safely and clears malformed storage: %s',
    (storedValue) => {
      window.sessionStorage.setItem(storageKey, storedValue);
      const store = createApplicationModeStore(window.sessionStorage);

      expect(store.getMode()).toBeNull();
      expect(window.sessionStorage.getItem(storageKey)).toBeNull();
    },
  );

  it('clears the selected mode', () => {
    const store = createApplicationModeStore(window.sessionStorage);
    store.setMode('speed');

    store.clearMode();

    expect(store.getMode()).toBeNull();
  });
});
