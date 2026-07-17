import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { GroupsPage } from './GroupsPage';
import { GroupsPage as GroupsPageFromIndex } from './index';
import { mockGroups } from './groups.mock';

// Helper: wait for loading to finish
async function renderAndWait() {
  render(<GroupsPage />);
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

  it('shows a loading state initially', () => {
    render(<GroupsPage />);
    expect(screen.getByRole('status', { name: /loading groups/i })).toBeInTheDocument();
  });

  it('renders all 4 summary cards after loading', async () => {
    await renderAndWait();
    // Summary section contains all 4 labels
    const summary = screen.getByRole('region', { name: /summary/i });
    expect(summary).toHaveTextContent('Total Groups');
    expect(summary).toHaveTextContent('Active');
    expect(summary).toHaveTextContent('Pending');
    expect(summary).toHaveTextContent('Suspended');
  });

  it('shows correct total count in summary', async () => {
    await renderAndWait();
    // Use within() to scope to summary section only
    const summary = screen.getByRole('region', { name: /summary/i });
    const totalCount = mockGroups.length;
    // The stat card for 'Total Groups' should show the total count
    expect(summary).toHaveTextContent(String(totalCount));
  });

  it('renders group names from mock data', async () => {
    await renderAndWait();
    // Check a few group names appear
    expect(screen.getAllByText(/Sunrise Fleet Operations/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Kiyaan Family Tracker/i).length).toBeGreaterThan(0);
  });

  it('filters groups by search', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'Kiyaan');

    expect(screen.getAllByText(/Kiyaan Family Tracker/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Sunrise Fleet Operations/i)).not.toBeInTheDocument();
  });

  it('filters groups by visibility — public', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const visibilitySelect = screen.getByLabelText(/filter by visibility/i);
    await user.selectOptions(visibilitySelect, 'public');

    // All visible items should have public visibility badge (via aria-label)
    expect(screen.getAllByLabelText(/visibility: public/i).length).toBeGreaterThan(0);
    expect(screen.queryByLabelText(/visibility: private/i)).not.toBeInTheDocument();
  });

  it('filters groups by visibility — private', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const visibilitySelect = screen.getByLabelText(/filter by visibility/i);
    await user.selectOptions(visibilitySelect, 'private');

    expect(screen.getAllByLabelText(/visibility: private/i).length).toBeGreaterThan(0);
    expect(screen.queryByLabelText(/visibility: public/i)).not.toBeInTheDocument();
  });

  it('filters groups by status — active', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const statusSelect = screen.getByLabelText(/filter by status/i);
    await user.selectOptions(statusSelect, 'active');

    // Active badges should exist; no Pending or Suspended STATUS badges in list
    expect(screen.getAllByLabelText(/status: active/i).length).toBeGreaterThan(0);
    expect(screen.queryByLabelText(/status: pending/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/status: suspended/i)).not.toBeInTheDocument();
  });

  it('filters groups by status — pending', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const statusSelect = screen.getByLabelText(/filter by status/i);
    await user.selectOptions(statusSelect, 'pending');

    expect(screen.getAllByLabelText(/status: pending/i).length).toBeGreaterThan(0);
    expect(screen.queryByLabelText(/status: active/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/status: suspended/i)).not.toBeInTheDocument();
  });

  it('filters groups by status — suspended', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const statusSelect = screen.getByLabelText(/filter by status/i);
    await user.selectOptions(statusSelect, 'suspended');

    expect(screen.getAllByLabelText(/status: suspended/i).length).toBeGreaterThan(0);
    expect(screen.queryByLabelText(/status: active/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/status: pending/i)).not.toBeInTheDocument();
  });

  it('applies combined filters (private + active)', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const visibilitySelect = screen.getByLabelText(/filter by visibility/i);
    const statusSelect = screen.getByLabelText(/filter by status/i);

    await user.selectOptions(visibilitySelect, 'private');
    await user.selectOptions(statusSelect, 'active');

    // Private + Active groups: grp-007 and grp-008
    expect(screen.getAllByText(/Kiyaan Family Tracker/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Executive Security Detail/i).length).toBeGreaterThan(0);
    // Public Active groups should not appear
    expect(screen.queryByText(/Sunrise Fleet Operations/i)).not.toBeInTheDocument();
    // No Pending/Suspended badges in the cards
    expect(screen.queryByLabelText(/status: pending/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/status: suspended/i)).not.toBeInTheDocument();
  });

  it('shows "no results" empty state when filters produce zero results', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'xyznonexistentgroup123');

    expect(screen.getByText(/no groups match your filters/i)).toBeInTheDocument();
  });

  it('Clear Filters button resets filters and shows all groups', async () => {
    const user = userEvent.setup();
    await renderAndWait();

    // Apply a filter
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'xyznonexistentgroup123');

    // Clear Filters button should appear
    const clearButton = screen.getByRole('button', { name: /clear all filters/i });
    await user.click(clearButton);

    // All groups should be visible again
    expect(screen.getAllByText(/Sunrise Fleet Operations/i).length).toBeGreaterThan(0);
  });

  it('status badge labels are correct for all statuses', async () => {
    await renderAndWait();

    // Check aria-label badges which are per-card (not summary cards)
    expect(screen.getAllByLabelText(/status: active/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/status: pending/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/status: suspended/i).length).toBeGreaterThan(0);
  });

  it('visibility badge labels are correct', async () => {
    await renderAndWait();
    expect(screen.getAllByLabelText(/visibility: public/i).length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText(/visibility: private/i).length).toBeGreaterThan(0);
  });

  it('Create Group button is disabled', async () => {
    await renderAndWait();
    const createButtons = screen.getAllByRole('button', { name: /create group/i });
    // At least one Create Group button exists and is disabled
    const disabledButton = createButtons.find((btn) => btn.hasAttribute('disabled'));
    expect(disabledButton).toBeTruthy();
  });

  it('GroupsPage can be imported from the index barrel', () => {
    expect(GroupsPageFromIndex).toBeDefined();
    expect(GroupsPageFromIndex).toBe(GroupsPage);
  });
});
