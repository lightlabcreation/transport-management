import { useState, useEffect } from 'react';

import type {
  Group,
  GroupRole,
  GroupCapability,
  GroupMember,
  JoinRequest,
} from './groups.types';
import { Button } from '@/components/ui/button';
import { MemberManagementList } from './components/MemberManagementList';
import { JoinRequestsPanel } from './components/JoinRequestsPanel';

interface GroupDetailsPageProps {
  group: Group;
  onBack: () => void;
}

const DEFAULT_ROLE_CAPABILITIES: Record<GroupRole, GroupCapability[]> = {
  owner: [
    'edit_group',
    'invite_members',
    'remove_members',
    'block_members',
    'approve_join_requests',
    'reject_join_requests',
    'assign_roles',
    'edit_permissions',
    'view_live_map',
    'export_reports',
  ],
  delegated_admin: [
    'invite_members',
    'approve_join_requests',
    'reject_join_requests',
    'view_live_map',
  ],
  admin: [
    'invite_members',
    'remove_members',
    'approve_join_requests',
    'reject_join_requests',
    'view_live_map',
  ],
  moderator: [
    'invite_members',
    'approve_join_requests',
    'reject_join_requests',
  ],
  member: ['view_live_map'],
  guest: [],
};

const ALL_CAPABILITIES: GroupCapability[] = [
  'edit_group',
  'invite_members',
  'remove_members',
  'block_members',
  'approve_join_requests',
  'reject_join_requests',
  'assign_roles',
  'edit_permissions',
  'view_live_map',
  'export_reports',
];

export function GroupDetailsPage({ group, onBack }: GroupDetailsPageProps) {
  // Viewer simulation context state
  const [selectedRole, setSelectedRole] = useState<GroupRole>('owner');
  const [activeCapabilities, setActiveCapabilities] = useState<GroupCapability[]>(
    DEFAULT_ROLE_CAPABILITIES.owner
  );

  // Group data state for mock interactivity
  const [members, setMembers] = useState<GroupMember[]>(group.members || []);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>(group.joinRequests || []);
  const [localGroup, setLocalGroup] = useState<Group>(group);

  // Local notifications / simulation feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfirmDestructive, setShowConfirmDestructive] = useState<{
    action: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // Synchronize when active role changes
  useEffect(() => {
    setActiveCapabilities(DEFAULT_ROLE_CAPABILITIES[selectedRole]);
  }, [selectedRole]);

  // Handle Toast timeout
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  function triggerFeedback(message: string) {
    setToastMessage(message);
  }

  // Capability toggler
  function toggleCapability(cap: GroupCapability) {
    setActiveCapabilities((prev) =>
      prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]
    );
  }

  // Members mutations
  function handleRemoveMember(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function handleBlockMember(memberId: string) {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function handleChangeRole(memberId: string, newRole: GroupRole) {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  }

  // Join requests actions
  function handleApproveRequest(requestId: string) {
    const target = joinRequests.find((r) => r.id === requestId);
    if (!target) return;

    // Simulate adding to member list
    const newMember: GroupMember = {
      id: `m-gen-${Date.now()}`,
      name: target.memberName,
      role: 'member',
      status: 'offline',
      lastSeen: 'Joined recently',
    };

    setMembers((prev) => [...prev, newMember]);
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  function handleRejectRequest(requestId: string) {
    setJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
  }

  // Group Details edits
  function handleEditGroup() {
    if (!activeCapabilities.includes('edit_group')) return;

    // Simulate edit with confirmation or feedback prompt
    triggerFeedback('Simulated: Opened group details edit form.');
  }

  function handleInviteMembers() {
    if (!activeCapabilities.includes('invite_members')) return;
    triggerFeedback('Simulated: Member invitation link generated and copied.');
  }

  function handleViewLiveMap() {
    if (!activeCapabilities.includes('view_live_map')) return;
    triggerFeedback('Simulated: Navigating to Live GPS Map View.');
  }

  function handleExportReports() {
    if (!activeCapabilities.includes('export_reports')) return;
    triggerFeedback('Simulated: Preparing CSV Report export for download.');
  }

  function handleDestructivePolicyReset() {
    if (selectedRole !== 'owner') return;

    setShowConfirmDestructive({
      action: 'Reset Policies',
      description: 'Are you sure you want to RESET all location-tracking policies to system defaults? This will apply to all members.',
      onConfirm: () => {
        setLocalGroup((prev) => ({
          ...prev,
          trackingPolicy: 'Default low frequency tracking.',
        }));
        triggerFeedback('Simulated: Group policies have been reset to defaults.');
        setShowConfirmDestructive(null);
      },
    });
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8" aria-label="Group details workspace">
      <div className="mx-auto max-w-[var(--container-content)] space-y-6">
        
        {/* Navigation / Simulation Notification Toast */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="outline" onClick={onBack} aria-label="Back to Groups list" className="self-start">
            ← Back to Directory
          </Button>

          {toastMessage && (
            <div
              className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-body-sm shadow-md animate-fade-in"
              role="alert"
              aria-live="polite"
            >
              {toastMessage}
            </div>
          )}
        </div>

        {/* Collapsible Destructive Action Confirmation */}
        {showConfirmDestructive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
              <h3 className="text-body-lg font-bold text-destructive">
                Destructive Action Confirmation
              </h3>
              <p className="mt-2 text-body-sm text-muted-foreground">
                {showConfirmDestructive.description}
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowConfirmDestructive(null)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={showConfirmDestructive.onConfirm}>
                  Proceed Action
                </Button>
              </div>

            </div>
          </div>
        )}

        {/* Dynamic Viewer Role Simulation Control Panel */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h4 className="text-body-sm font-bold text-primary uppercase tracking-wider">
                Viewer Role Simulator Panel
              </h4>
              <p className="text-body-xs text-muted-foreground">
                Switch viewer roles and toggle capabilities to preview dynamic permissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="role-select" className="text-body-xs font-semibold">
                Active Viewer Role:
              </label>
              <select
                id="role-select"
                className="rounded-md border border-border bg-card px-3 py-1.5 text-body-sm focus:outline-none"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as GroupRole)}
              >
                <option value="owner">Group Owner</option>
                <option value="delegated_admin">Delegated Admin</option>
                <option value="admin">Group Admin</option>
                <option value="moderator">Moderator</option>
                <option value="member">Member</option>
                <option value="guest">Group Guest</option>
              </select>
            </div>
          </div>

          {/* Capabilities Toggler Checklist */}
          <div className="pt-3 border-t border-primary/10">
            <p className="text-body-xs font-bold text-foreground">
              Assigned Permissions / Capabilities:
            </p>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {ALL_CAPABILITIES.map((cap) => {
                const isChecked = activeCapabilities.includes(cap);
                return (
                  <label
                    key={cap}
                    className={`flex items-center gap-2 rounded-md p-2 border text-[11px] font-medium cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-card border-primary/40 text-primary'
                        : 'bg-card/50 border-border text-muted-foreground'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="accent-primary"
                      checked={isChecked}
                      onChange={() => toggleCapability(cap)}
                    />
                    {cap.replace('_', ' ')}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Group Header Presentation */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-body-lg">
                {localGroup.initials}
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-2">
                  <h1 className="text-heading-md font-bold text-foreground">{localGroup.name}</h1>
                  <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-body-xs font-semibold text-muted-foreground capitalize">
                    {localGroup.category || 'General'}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-body-xs font-semibold capitalize border ${
                    localGroup.visibility === 'public'
                      ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                      : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                  }`}>
                    {localGroup.visibility}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-body-xs font-semibold capitalize border ${
                    localGroup.status === 'active'
                      ? 'bg-green-500/10 text-green-600 border-green-500/20'
                      : localGroup.status === 'pending'
                      ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      : 'bg-red-500/10 text-red-600 border-red-500/20'
                  }`}>
                    {localGroup.status}
                  </span>
                </div>
                <p className="mt-2 text-body-sm text-muted-foreground">{localGroup.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-start">
              {activeCapabilities.includes('edit_group') ? (
                <Button variant="outline" onClick={handleEditGroup} aria-label="Edit group information">
                  Edit Group
                </Button>
              ) : (
                <span className="text-body-xs text-muted-foreground italic bg-muted border border-border rounded-md px-2.5 py-1">
                  ReadOnly Access
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Policies & Info Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Action Buttons Panel */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-body-md font-bold text-foreground">Available Actions</h3>
              <div className="flex flex-wrap gap-3">
                {activeCapabilities.includes('invite_members') && (
                  <Button onClick={handleInviteMembers} aria-label="Invite new members">
                    Invite Members
                  </Button>
                )}
                
                {activeCapabilities.includes('view_live_map') && (
                  <Button variant="outline" onClick={handleViewLiveMap} aria-label="View live GPS telemetry map">
                    View Live Map
                  </Button>
                )}

                {activeCapabilities.includes('export_reports') && (
                  <Button variant="outline" onClick={handleExportReports} aria-label="Export reports file">
                    Export Reports
                  </Button>
                )}

                {selectedRole === 'owner' && (
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    onClick={handleDestructivePolicyReset}
                    aria-label="Reset group policies"
                  >
                    Reset Policies
                  </Button>
                )}

                {!activeCapabilities.includes('invite_members') &&
                  !activeCapabilities.includes('view_live_map') &&
                  !activeCapabilities.includes('export_reports') && (
                    <p className="text-body-sm text-muted-foreground italic">
                      No actions available for your current simulator role.
                    </p>
                  )}
              </div>
            </div>

            {/* Members presentation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-heading-sm font-bold text-foreground">Members Directory</h2>
                <span className="text-body-xs text-muted-foreground font-semibold">
                  Showing {members.length} member{members.length !== 1 ? 's' : ''}
                </span>
              </div>
              <MemberManagementList
                members={members}
                viewerCapabilities={activeCapabilities}
                onActionTriggered={triggerFeedback}
                onRemoveMember={handleRemoveMember}
                onBlockMember={handleBlockMember}
                onChangeRole={handleChangeRole}
              />
            </div>
          </div>

          {/* Right sidebar details */}
          <div className="space-y-6">
            {/* Policies section */}
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h3 className="text-body-md font-bold text-foreground">Policies Summary</h3>
              
              <div className="space-y-3 divide-y divide-border">
                <div className="pt-0">
                  <p className="text-body-xs font-semibold text-muted-foreground uppercase">Tracking Policy</p>
                  <p className="mt-1 text-body-sm text-foreground">
                    {localGroup.trackingPolicy || 'No policy defined.'}
                  </p>
                </div>
                
                <div className="pt-3">
                  <p className="text-body-xs font-semibold text-muted-foreground uppercase">Visibility Policy</p>
                  <p className="mt-1 text-body-sm text-foreground">
                    {localGroup.visibilityPolicy || 'No policy defined.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Join Requests section */}
            <JoinRequestsPanel
              requests={joinRequests}
              viewerCapabilities={activeCapabilities}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onActionTriggered={triggerFeedback}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
