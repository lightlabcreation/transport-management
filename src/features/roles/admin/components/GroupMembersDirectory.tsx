import { useState, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { GroupMemberRecord, MemberRoleType } from '../admin.types';

interface GroupMembersDirectoryProps {
  initialMembers: GroupMemberRecord[];
  selectedGroupId: string;
}

export function GroupMembersDirectory({
  initialMembers,
  selectedGroupId,
}: GroupMembersDirectoryProps) {
  const [members, setMembers] = useState<GroupMemberRecord[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const currentGroupMembers = useMemo(() => {
    return members
      .filter((m) => m.groupId === selectedGroupId)
      .filter((m) => {
        const query = searchQuery.toLowerCase();
        return (
          m.name.toLowerCase().includes(query) || m.mobile.toLowerCase().includes(query)
        );
      });
  }, [members, selectedGroupId, searchQuery]);

  const handleRoleChange = (memberId: string, newRole: MemberRoleType) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m)),
    );
    setStatusMessage(`Member role updated successfully to ${newRole}.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleToggleStatus = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m;
        const nextStatus = m.status === 'active' ? 'suspended' : 'active';
        return { ...m, status: nextStatus };
      }),
    );
  };

  const handleRemoveMember = (memberId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from this group?`)) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      setStatusMessage(`${name} has been removed from the group.`);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-heading-md font-semibold tracking-tight text-foreground">
            Group Member Directory & Role Hierarchy
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Assign moderator permissions, suspend participants, and check live speed/battery telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">{currentGroupMembers.length} Active Participants</Badge>
        </div>
      </div>

      {statusMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-body-sm font-medium text-success"
        >
          {statusMessage}
        </div>
      )}

      <div className="mt-5 w-full sm:max-w-md">
        <Input
          placeholder="Search member by name or mobile number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search group members"
        />
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-3 font-semibold">Participant Details</th>
              <th className="pb-3 font-semibold">Live Telemetry</th>
              <th className="pb-3 font-semibold">Assigned Role</th>
              <th className="pb-3 font-semibold">Account Status</th>
              <th className="pb-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentGroupMembers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No members matched your search in this group.
                </td>
              </tr>
            ) : (
              currentGroupMembers.map((m) => (
                <tr key={m.id} className="transition-colors hover:bg-surface-muted/50">
                  <td className="py-4">
                    <p className="font-semibold text-foreground">{m.name}</p>
                    <p className="text-body-xs text-muted-foreground">{m.mobile}</p>
                    <p className="text-body-xs text-muted-foreground">Seen: {m.lastSeen}</p>
                  </td>
                  <td className="py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{m.currentSpeed}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-body-xs text-muted-foreground">
                        <span>🔋 {m.batteryPercent}%</span>
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-surface-muted">
                          <div
                            className={`h-full ${
                              m.batteryPercent < 20
                                ? 'bg-danger'
                                : m.batteryPercent < 50
                                  ? 'bg-warning'
                                  : 'bg-success'
                            }`}
                            style={{ width: `${m.batteryPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    {m.role === 'Group Admin' ? (
                      <Badge variant="primary">Group Admin</Badge>
                    ) : (
                      <select
                        value={m.role}
                        onChange={(e) =>
                          handleRoleChange(m.id, e.target.value as MemberRoleType)
                        }
                        className="rounded border border-input bg-surface px-2 py-1 text-body-xs font-medium text-foreground transition-colors focus:border-primary focus:outline-none"
                      >
                        <option value="Moderator">Moderator</option>
                        <option value="Member">Member</option>
                        <option value="Group Guest">Group Guest</option>
                      </select>
                    )}
                  </td>
                  <td className="py-4">
                    <Badge variant={m.status === 'active' ? 'success' : 'danger'}>
                      {m.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    {m.role === 'Group Admin' ? (
                      <span className="text-body-xs font-medium text-muted-foreground">
                        Protected Admin
                      </span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant={m.status === 'active' ? 'outline' : 'primary'}
                          onClick={() => handleToggleStatus(m.id)}
                        >
                          {m.status === 'active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRemoveMember(m.id, m.name)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
