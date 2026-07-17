import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { createApplicationModeStore } from './application-mode-store';
import { ApplicationModeReset } from './ApplicationModeReset';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('ApplicationModeReset', () => {
  it('preserves an onboarding mode during a normal Login entry', () => {
    const modeStore = createApplicationModeStore(window.sessionStorage);
    modeStore.setMode('tracking');

    render(
      <ApplicationModeReset modeStore={modeStore} shouldReset={() => false}>
        <p>Login</p>
      </ApplicationModeReset>,
    );

    expect(modeStore.getMode()).toBe('tracking');
  });

  it('clears the selected mode during a logout entry', async () => {
    const modeStore = createApplicationModeStore(window.sessionStorage);
    modeStore.setMode('speed');

    render(
      <ApplicationModeReset modeStore={modeStore} shouldReset={() => true}>
        <p>Login</p>
      </ApplicationModeReset>,
    );

    await waitFor(() => expect(modeStore.getMode()).toBeNull());
  });
});
