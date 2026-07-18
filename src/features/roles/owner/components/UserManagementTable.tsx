import { useState, useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PlatformUser, UserRoleName } from '../owner.types';

interface UserManagementTableProps {
  initialUsers: PlatformUser[];
}

export function UserManagementTable({ initialUsers }: UserManagementTableProps) {
  const [users, setUsers] = useState<PlatformUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [exportMessage, setExportMessage] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.mobile.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query));

      const matchesRole = selectedRole === 'all' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, selectedRole]);

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        if (u.role === 'Group Owner') return u; // Protect owner account from suspension
        const nextStatus = u.status === 'active' ? 'suspended' : 'active';
        return { ...u, status: nextStatus };
      }),
    );
  };

  const handleExport = () => {
    setExportMessage(
      'Simulated Excel/PDF export triggered. Your redacted user registry is being downloaded.',
    );
    setTimeout(() => setExportMessage(''), 6000);
  };

  const rolesList: UserRoleName[] = [
    'Group Owner',
    'Super Admin',
    'Group Admin',
    'Moderator',
    'Member',
    'Group Guest',
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-heading-md font-semibold tracking-tight text-foreground">
            Platform User & Role Directory
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Manage permissions, account lifecycle status, and export system-wide user summaries.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <svg
              className="mr-2 size-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Excel/CSV
          </Button>
        </div>
      </div>

      {exportMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-info/30 bg-info/10 p-3 text-body-sm font-medium text-info"
        >
          {exportMessage}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search by name, mobile, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search user directory"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant={selectedRole === 'all' ? 'primary' : 'ghost'}
            onClick={() => setSelectedRole('all')}
          >
            All Roles ({users.length})
          </Button>
          {rolesList.map((role) => {
            const count = users.filter((u) => u.role === role).length;
            return (
              <Button
                key={role}
                size="sm"
                variant={selectedRole === role ? 'primary' : 'ghost'}
                onClick={() => setSelectedRole(role)}
              >
                {role} ({count})
              </Button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-3 font-semibold">User Account</th>
              <th className="pb-3 font-semibold">Contact Details</th>
              <th className="pb-3 font-semibold">Assigned Role</th>
              <th className="pb-3 font-semibold">Groups & Joined</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No users matched your search criteria.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="transition-colors hover:bg-surface-muted/50">
                  <td className="py-4">
                    <p className="font-semibold text-foreground">{u.name}</p>
                    <p className="text-body-xs text-muted-foreground">Last seen: {u.lastSeen}</p>
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-foreground">{u.mobile}</p>
                    <p className="text-body-xs text-muted-foreground">
                      {u.email || 'No email provided'}
                    </p>
                  </td>
                  <td className="py-4">
                    <Badge
                      variant={
                        u.role === 'Group Owner'
                          ? 'primary'
                          : u.role === 'Super Admin' || u.role === 'Group Admin'
                            ? 'info'
                            : 'neutral'
                      }
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-foreground">{u.groupsCount} active groups</p>
                    <p className="text-body-xs text-muted-foreground">Joined {u.joinedAt}</p>
                  </td>
                  <td className="py-4">
                    <Badge
                      variant={
                        u.status === 'active'
                          ? 'success'
                          : u.status === 'suspended'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {u.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    {u.role === 'Group Owner' ? (
                      <span className="text-body-xs text-muted-foreground font-medium">
                        Protected Owner
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant={u.status === 'active' ? 'outline' : 'primary'}
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
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
