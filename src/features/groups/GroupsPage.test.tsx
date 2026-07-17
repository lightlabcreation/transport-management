import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { GroupsPage } from './GroupsPage';
import { GroupsPage as GroupsPageFromIndex } from './index';
import { mockGroups } from './groups.mock';

const mockSession = {
  kind: 'authenticated',
  authenticatedAt: '2026-07-17T12:00:00.000Z',
  expiresAt: '2030-01-01T00:00:00.000Z',
};

beforeEach(() => {
  window.sessionStorage.clear();
  window.sessionStorage.setItem('transport-management.auth-session', JSON.stringify(mockSession));
  window.sessionStorage.setItem(
    'transport-management.demo-access-profile',
    JSON.stringify({ profileId: 'group-owner' }),
  );
  window.sessionStorage.setItem(
    'transport-management.application-mode',
    JSON.stringify({ mode: 'tracking' }),
  );
});

// Helper: wait for loading to finish with custom route wrapper
async function renderAndWait(profileId: string = 'group-owner') {
  window.sessionStorage.setItem(
    'transport-management.demo-access-profile',
    JSON.stringify({ profileId }),
  );

  const router = createMemoryRouter(
    [
      { path: '/auth/login', element: <h1>Sign in boundary</h1> },
      { path: '/app/access-preview', element: <h1>Access Preview boundary</h1> },
      { path: '/app/groups', element: <GroupsPage /> },
      { path: '/app/dashboard', element: <h1>Dashboard Page</h1> },
      { path: '/app/live-map', element: <h1>Live Map Page</h1> },
    ],
    { initialEntries: ['/app/groups'] },
  );

  render(<RouterProvider router={router} />);

  // Wait for loading spinner to disappear
  await waitFor(
    () => {
      expect(screen.queryByRole('status', { name: /loading groups/i })).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );
}

describe('GroupsPage', () => {
  it('renders the page heading', async () => {
    await renderAndWait();
    expect(screen.getByRole('heading', { level: 1, name: /groups/i })).toBeInTheDocument();
  });

  it('renders a supporting description', async () => {
    await renderAndWait();
    expect(screen.getByText(/manage your groups/i)).toBeInTheDocument();
  });

  it('renders all 4 summary cards after loading', async () => {
    await renderAndWait();
    const summary = screen.getByRole('region', { name: /summary/i });
    expect(summary).toHaveTextContent('Total Groups');
    expect(summary).toHaveTextContent('Active');
    expect(summary).toHaveTextContent('Pending');
    expect(summary).toHaveTextContent('Suspended');
  });

  it('shows correct total count in summary', async () => {
    await renderAndWait();
    const summary = screen.getByRole('region', { name: /summary/i });
    const totalCount = mockGroups.length;
    expect(summary).toHaveTextContent(String(totalCount));
  });

  it('renders group names from mock data', async () => {
    await renderAndWait();
    expect(screen.getAllByText(/Sunrise Fleet Operations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kiyaan Family Tracker/i).length).toBeGreaterThan(0);
  });

  it('filters groups by search', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const searchInput = screen.getByRole('searchbox', { name: /search groups/i });
    await user.type(searchInput, 'Kiyaan');

    expect(screen.getAllByText(/Kiyaan Family Tracker/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sunrise Fleet Operations/i)).not.toBeInTheDocument();
  });

  it('filters groups by visibility — public', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const visibilitySelect = screen.getByRole('combobox', { name: /filter by visibility/i });
    await user.selectOptions(visibilitySelect, 'public');

    expect(screen.getAllByText(/Sunrise Fleet Operations/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Kiyaan Family Tracker/i)).not.toBeInTheDocument();
  });

  it('filters groups by visibility — private', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const visibilitySelect = screen.getByRole('combobox', { name: /filter by visibility/i });
    await user.selectOptions(visibilitySelect, 'private');

    expect(screen.getAllByText(/Kiyaan Family Tracker/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sunrise Fleet Operations/i)).not.toBeInTheDocument();
  });

  it('filters groups by status — active', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const statusSelect = screen.getByRole('combobox', { name: /filter by status/i });
    await user.selectOptions(statusSelect, 'active');

    expect(screen.getAllByText(/Sunrise Fleet Operations/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Nightshift Patrol Alpha/i)).not.toBeInTheDocument();
  });

  it('filters groups by status — pending', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const statusSelect = screen.getByRole('combobox', { name: /filter by status/i });
    await user.selectOptions(statusSelect, 'pending');

    expect(screen.getAllByText(/Westpark Construction Crew/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sunrise Fleet Operations/i)).not.toBeInTheDocument();
  });

  it('filters groups by status — suspended', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const statusSelect = screen.getByRole('combobox', { name: /filter by status/i });
    await user.selectOptions(statusSelect, 'suspended');

    expect(screen.getAllByText(/Summit Events Transport/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sunrise Fleet Operations/i)).not.toBeInTheDocument();
  });

  it('applies combined filters (private + active)', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const visibilitySelect = screen.getByRole('combobox', { name: /filter by visibility/i });
    await user.selectOptions(visibilitySelect, 'private');

    const statusSelect = screen.getByRole('combobox', { name: /filter by status/i });
    await user.selectOptions(statusSelect, 'active');

    expect(screen.getAllByText(/Kiyaan Family Tracker/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sunrise Fleet Operations/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Nightshift Patrol Alpha/i)).not.toBeInTheDocument();
  });

  it('shows "no results" empty state when filters produce zero results', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const searchInput = screen.getByRole('searchbox', { name: /search groups/i });
    await user.type(searchInput, 'xyznonexistentgroup123');

    expect(screen.getByText(/no groups match your filters/i)).toBeInTheDocument();
  });

  it('Clear Filters button resets filters and shows all groups', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const searchInput = screen.getByRole('searchbox', { name: /search groups/i });
    await user.type(searchInput, 'xyznonexistentgroup123');

    const clearButton = screen.getByRole('button', { name: /clear all filters/i });
    await user.click(clearButton);

    expect(screen.getAllByText(/Sunrise Fleet Operations/i).length).toBeGreaterThan(0);
  });

  it('status badge labels are correct for all statuses', async () => {
    await renderAndWait();
    expect(screen.getAllByLabelText(/status: active/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/status: pending/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/status: suspended/i).length).toBeGreaterThan(0);
  });

  it('visibility badge labels are correct', async () => {
    await renderAndWait();
    expect(screen.getAllByLabelText(/visibility: public/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/visibility: private/i).length).toBeGreaterThan(0);
  });

  it('Create Group button is enabled and opens wizard for Owner', async () => {
    const user = userEvent.setup();
    await renderAndWait('group-owner');
    const createButton = screen.getByRole('button', { name: 'Create new group' });
    expect(createButton).not.toBeDisabled();
    await user.click(createButton);
    expect(
      screen.getByRole('heading', { level: 2, name: /Group Information/i }),
    ).toBeInTheDocument();
  });

  it('Shared navigation renders on Groups and links are present', async () => {
    await renderAndWait();
    const nav = screen.getByRole('navigation', { name: /desktop navigation/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /groups/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /live map/i }).length).toBeGreaterThan(0);
  });

  it('Active item uses aria-current', async () => {
    await renderAndWait();
    const groupsLinks = screen.getAllByRole('link', { name: /groups/i });
    const activeLink = groupsLinks.find((link) => link.getAttribute('aria-current') === 'page');
    expect(activeLink).toBeDefined();
  });

  it('Member profile sees read-only presentation (Create Group hidden)', async () => {
    await renderAndWait('member');
    expect(screen.queryByRole('button', { name: 'Create new group' })).not.toBeInTheDocument();
  });

  it('Guest profile sees restricted presentation (Create Group hidden)', async () => {
    await renderAndWait('group-guest');
    expect(screen.queryByRole('button', { name: 'Create new group' })).not.toBeInTheDocument();
  });

  it('Logout behavior clears session', async () => {
    const user = userEvent.setup();
    await renderAndWait();
    const logoutBtns = screen.getAllByRole('button', { name: /log out/i });
    const logoutBtn = logoutBtns[0];
    expect(logoutBtn).toBeDefined();
    await user.click(logoutBtn!);
    expect(window.sessionStorage.getItem('transport-management.auth-session')).toBeNull();
  });

  it('hides Live Map and Groups navigation links in speed mode', async () => {
    window.sessionStorage.setItem(
      'transport-management.application-mode',
      JSON.stringify({ mode: 'speed' }),
    );
    await renderAndWait();
    expect(screen.queryByRole('link', { name: /live map/i })).not.toBeInTheDocument();
  });

  it('GroupsPage can be imported from the index barrel', () => {
    expect(GroupsPageFromIndex).toBeDefined();
    expect(GroupsPageFromIndex).toBe(GroupsPage);
  });
});
