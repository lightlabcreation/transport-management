import { useState } from 'react';
import type { GroupMember, GroupCapability, GroupRole } from '../groups.types';
import { Button } from '@/components/ui/button';

interface MemberManagementListProps {
  members: GroupMember[];
  viewerCapabilities: GroupCapability[];
  onActionTriggered: (message: string) => void;
  onRemoveMember: (memberId: string) => void;
  onBlockMember: (memberId: string) => void;
  onChangeRole: (memberId: string, newRole: GroupRole) => void;
}

export function MemberManagementList({
  members,
  viewerCapabilities,
  onActionTriggered,
  onRemoveMember,
  onBlockMember,
  onChangeRole,
}: MemberManagementListProps) {
  const [confirmTarget, setConfirmTarget] = useState<{
    memberId: string;
    memberName: string;
    action: 'remove' | 'block';
  } | null>(null);

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const canRemove = viewerCapabilities.includes('remove_members');
  const canBlock = viewerCapabilities.includes('block_members');
  const canAssignRoles = viewerCapabilities.includes('assign_roles');

  function getRoleBadgeStyles(role: GroupRole) {
    switch (role) {
      case 'owner':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      case 'delegated_admin':
        return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
      case 'admin':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'moderator':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'member':
        return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'guest':
        return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border border-gray-500/20';
    }
  }

  function handleActionClick(memberId: string, memberName: string, action: 'remove' | 'block') {
    setConfirmTarget({ memberId, memberName, action });
  }

  function executeConfirmedAction() {
    if (!confirmTarget) return;

    const { memberId, memberName, action } = confirmTarget;
    if (action === 'remove') {
      onRemoveMember(memberId);
      onActionTriggered(`Simulated: Member "${memberName}" has been removed from the group.`);
    } else {
      onBlockMember(memberId);
      onActionTriggered(`Simulated: Member "${memberName}" has been blocked.`);
    }
    setConfirmTarget(null);

  }

  return (
    <div className="space-y-4">
      {/* Confirmation Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 className="text-body-lg font-bold text-foreground">
              Confirm {confirmTarget.action === 'remove' ? 'Removal' : 'Block'}
            </h3>
            <p className="mt-2 text-body-sm text-muted-foreground">
              Are you sure you want to {confirmTarget.action} <strong>{confirmTarget.memberName}</strong>? 
              This action will take effect immediately.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setConfirmTarget(null)}
                aria-label="Cancel confirmation"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={executeConfirmedAction}
                aria-label={`Confirm ${confirmTarget.action}`}
              >
                Confirm {confirmTarget.action === 'remove' ? 'Remove' : 'Block'}
              </Button>
            </div>

          </div>
        </div>
      )}

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          <p className="text-body-sm">No members found in this group.</p>
        </div>
      ) : (
        <>
          {/* Desktop View: Structured List / Table */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card">
            <table className="w-full border-collapse text-left text-body-sm text-foreground">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Seen</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-body-xs">
                          {member.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingMemberId === member.id ? (
                        <select
                          className="rounded-md border border-border bg-card px-2 py-1 text-body-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          value={member.role}
                          onChange={(e) => {
                            onChangeRole(member.id, e.target.value as GroupRole);
                            setEditingMemberId(null);
                            onActionTriggered(`Simulated: Updated ${member.name}'s role to ${e.target.value}.`);
                          }}
                          aria-label="Change member role dropdown"
                        >
                          <option value="owner">Owner</option>
                          <option value="delegated_admin">Delegated Admin</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="member">Member</option>
                          <option value="guest">Guest</option>
                        </select>
                      ) : (
                        <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getRoleBadgeStyles(member.role)}`}>
                          {member.role.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-2.5 rounded-full ${
                            member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        />
                        <span className="capitalize">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{member.lastSeen}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {canAssignRoles && editingMemberId !== member.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingMemberId(member.id)}
                            aria-label={`Change role for ${member.name}`}
                          >
                            Change Role
                          </Button>
                        )}
                        {canRemove && member.role !== 'owner' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:bg-red-50"
                            onClick={() => handleActionClick(member.id, member.name, 'remove')}
                            aria-label={`Remove ${member.name} from group`}
                          >
                            Remove
                          </Button>
                        )}
                        {canBlock && member.role !== 'owner' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleActionClick(member.id, member.name, 'block')}
                            aria-label={`Block ${member.name}`}
                          >
                            Block
                          </Button>
                        )}
                        {!canRemove && !canBlock && !canAssignRoles && (
                          <span className="text-body-xs text-muted-foreground italic">Read-only</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View: Fluid Cards List */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {members.map((member) => (
              <div key={member.id} className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-medium text-primary text-body-xs">
                      {member.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{member.name}</h4>
                      <p className="text-body-xs text-muted-foreground">Seen {member.lastSeen}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getRoleBadgeStyles(member.role)}`}>
                      {member.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Mobile action controls */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border justify-end">
                  {canAssignRoles && (
                    <div className="flex items-center gap-1">
                      {editingMemberId === member.id ? (
                        <select
                          className="rounded-md border border-border bg-card px-2 py-1 text-body-xs focus:outline-none"
                          value={member.role}
                          onChange={(e) => {
                            onChangeRole(member.id, e.target.value as GroupRole);
                            setEditingMemberId(null);
                            onActionTriggered(`Simulated: Updated ${member.name}'s role to ${e.target.value}.`);
                          }}
                          aria-label="Change member role dropdown"
                        >
                          <option value="owner">Owner</option>
                          <option value="delegated_admin">Delegated Admin</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                          <option value="member">Member</option>
                          <option value="guest">Guest</option>
                        </select>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingMemberId(member.id)}
                          aria-label={`Change role for ${member.name}`}
                        >
                          Change Role
                        </Button>
                      )}
                    </div>
                  )}
                  {canRemove && member.role !== 'owner' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleActionClick(member.id, member.name, 'remove')}
                      aria-label={`Remove ${member.name} from group`}
                    >
                      Remove
                    </Button>
                  )}
                  {canBlock && member.role !== 'owner' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleActionClick(member.id, member.name, 'block')}
                      aria-label={`Block ${member.name}`}
                    >
                      Block
                    </Button>
                  )}
                  {!canRemove && !canBlock && !canAssignRoles && (
                    <span className="text-body-xs text-muted-foreground italic">Read-only view</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
