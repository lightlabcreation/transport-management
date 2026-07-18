import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { createDemoAccessStore } from './demo-access-store';
import { demoAccessProfiles } from './demo-access.profiles';
import { DemoCapabilityGate } from './DemoCapabilityGate';

beforeEach(() => {
  window.sessionStorage.clear();
});

describe('DemoCapabilityGate', () => {
  it('renders content when the selected profile has the capability', () => {
    const accessStore = createDemoAccessStore(window.sessionStorage);
    accessStore.setProfile(demoAccessProfiles.find((profile) => profile.id === 'member')!);

    render(
      <MemoryRouter>
        <DemoCapabilityGate accessStore={accessStore} capability="view-trips">
          <p>Trip content</p>
        </DemoCapabilityGate>
      </MemoryRouter>,
    );

    expect(screen.getByText('Trip content')).toBeInTheDocument();
  });

  it('fails closed with an explanation when the capability is unavailable', () => {
    const accessStore = createDemoAccessStore(window.sessionStorage);
    accessStore.setProfile(demoAccessProfiles.find((profile) => profile.id === 'group-guest')!);

    render(
      <MemoryRouter>
        <DemoCapabilityGate accessStore={accessStore} capability="view-live-map">
          <p>Map content</p>
        </DemoCapabilityGate>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Map content')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Access unavailable' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Return to a safe page' })).toHaveAttribute(
      'href',
      '/app/dashboard',
    );
  });

  it('rejects a missing profile safely', () => {
    const accessStore = createDemoAccessStore(window.sessionStorage);

    render(
      <MemoryRouter>
        <DemoCapabilityGate accessStore={accessStore} capability="view-dashboard">
          <p>Dashboard content</p>
        </DemoCapabilityGate>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Access unavailable' })).toBeInTheDocument();
  });
});
