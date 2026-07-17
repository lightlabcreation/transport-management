import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GroupDetailsPage } from './GroupDetailsPage';
import type { Group } from './groups.types';

const mockGroupData: Group = {
  id: 'grp-test-001',
  name: 'Test Logistics Group',
  description: 'Test description for logistics group.',
  visibility: 'private',
  status: 'active',
  memberCount: 2,
  lastUpdated: '2026-07-16T12:00:00Z',
  initials: 'TL',
  category: 'Logistics',
  trackingPolicy: 'Tracking is active during shifts.',
  visibilityPolicy: 'Only members can view telemetry.',
  members: [
    {
      id: 'm-1',
      name: 'Nishant Solanki',
      role: 'owner',
      status: 'online',
      lastSeen: 'Active now',
    },
    {
      id: 'm-2',
      name: 'Amit Sharma',
      role: 'member',
      status: 'offline',
      lastSeen: '2 hours ago',
    },
  ],
  joinRequests: [
    {
      id: 'jr-1',
      memberName: 'Rajesh Kumar',
      requestedAt: '2026-07-16T14:30:00Z',
      status: 'pending',
    },
  ],
};

describe('GroupDetailsPage', () => {
  it('renders group basic information correctly', () => {
    const handleBack = vi.fn();
    render(<GroupDetailsPage group={mockGroupData} onBack={handleBack} />);

    expect(screen.getByRole('heading', { name: /Test Logistics Group/i })).toBeInTheDocument();
    expect(screen.getByText(/Test description for logistics group/i)).toBeInTheDocument();
    expect(screen.getByText('Logistics', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('private', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByText('active', { selector: 'span' })).toBeInTheDocument();
  });

  it('allows Group Owner to see all administrative controls and destructive button', () => {
    render(<GroupDetailsPage group={mockGroupData} onBack={vi.fn()} />);

    // Selector defaults to Owner
    const select = screen.getByLabelText(/Active Viewer Role:/i);
    expect(select).toHaveValue('owner');

    // Owner has edit capability, so Edit Group button is visible
    expect(screen.getByRole('button', { name: /Edit group information/i })).toBeInTheDocument();

    // Owner actions
    expect(screen.getByRole('button', { name: /Invite new members/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View live GPS telemetry map/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export reports file/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reset group policies/i })).toBeInTheDocument();
  });

  it('restricts Moderator from assigning roles, exporting reports or resetting policies', async () => {
    const user = userEvent.setup();
    render(<GroupDetailsPage group={mockGroupData} onBack={vi.fn()} />);

    // Select Moderator role in simulator
    const select = screen.getByLabelText(/Active Viewer Role:/i);
    await user.selectOptions(select, 'moderator');

    // Moderator cannot edit group
    expect(
      screen.queryByRole('button', { name: /Edit group information/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/ReadOnly Access/i)).toBeInTheDocument();

    // Moderator capabilities: can invite, can approve/reject join requests
    expect(screen.getByRole('button', { name: /Invite new members/i })).toBeInTheDocument();

    // Moderator cannot export, view map, or reset policies
    expect(screen.queryByRole('button', { name: /Export reports file/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /View live GPS telemetry map/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Reset group policies/i })).not.toBeInTheDocument();
  });

  it('limits Delegated Administrator to only selected/delegated capabilities', async () => {
    const user = userEvent.setup();
    render(<GroupDetailsPage group={mockGroupData} onBack={vi.fn()} />);

    const select = screen.getByLabelText(/Active Viewer Role:/i);
    await user.selectOptions(select, 'delegated_admin');

    // By default, delegated admin does NOT have edit_group or export_reports
    expect(
      screen.queryByRole('button', { name: /Edit group information/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Export reports file/i })).not.toBeInTheDocument();

    // They have view_live_map and invite_members by default
    expect(
      screen.getByRole('button', { name: /View live GPS telemetry map/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Invite new members/i })).toBeInTheDocument();
  });

  it('restricts Normal Member from administrative controls and only allows viewing live map', async () => {
    const user = userEvent.setup();
    render(<GroupDetailsPage group={mockGroupData} onBack={vi.fn()} />);

    const select = screen.getByLabelText(/Active Viewer Role:/i);
    await user.selectOptions(select, 'member');

    // Member cannot edit or invite or export
    expect(
      screen.queryByRole('button', { name: /Edit group information/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Invite/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Export/i })).not.toBeInTheDocument();

    // Member can view live map
    expect(
      screen.getByRole('button', { name: /View live GPS telemetry map/i }),
    ).toBeInTheDocument();
  });

  it('presents restricted read-only view for Guest with no action buttons', async () => {
    const user = userEvent.setup();
    render(<GroupDetailsPage group={mockGroupData} onBack={vi.fn()} />);

    const select = screen.getByLabelText(/Active Viewer Role:/i);
    await user.selectOptions(select, 'guest');

    // Guest has empty action state
    expect(
      screen.getByText(/No actions available for your current simulator role/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Invite/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Map/i })).not.toBeInTheDocument();
  });

  it('handles empty join requests safely', () => {
    const groupWithoutRequests: Group = {
      ...mockGroupData,
      joinRequests: [],
    };
    render(<GroupDetailsPage group={groupWithoutRequests} onBack={vi.fn()} />);

    expect(screen.getByText(/No pending join requests/i)).toBeInTheDocument();
  });

  it('requires confirmation workflow for destructive Owner actions', async () => {
    const user = userEvent.setup();
    render(<GroupDetailsPage group={mockGroupData} onBack={vi.fn()} />);

    // Find and click Reset Policies button (Owner only)
    const resetBtn = screen.getByRole('button', { name: /Reset group policies/i });
    await user.click(resetBtn);

    // Modal overlay is displayed
    expect(
      screen.getByRole('heading', { name: /Destructive Action Confirmation/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to RESET all location-tracking policies/i),
    ).toBeInTheDocument();

    // Clicking Proceed executes action and dismisses modal
    const proceedBtn = screen.getByRole('button', { name: /Proceed Action/i });
    await user.click(proceedBtn);

    expect(
      screen.queryByRole('heading', { name: /Destructive Action Confirmation/i }),
    ).not.toBeInTheDocument();
  });
});
