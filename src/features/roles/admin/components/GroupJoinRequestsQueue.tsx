import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GroupJoinRequest } from '../admin.types';

interface GroupJoinRequestsQueueProps {
  initialRequests: GroupJoinRequest[];
  selectedGroupId: string;
}

export function GroupJoinRequestsQueue({
  initialRequests,
  selectedGroupId,
}: GroupJoinRequestsQueueProps) {
  const [requests, setRequests] = useState<GroupJoinRequest[]>(initialRequests);
  const [statusMessage, setStatusMessage] = useState('');

  const currentRequests = requests
    .filter((r) => r.groupId === selectedGroupId)
    .filter((r) => r.status === 'pending');

  const handleAction = (id: string, action: 'approved' | 'rejected', name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r)),
    );
    setStatusMessage(`Request from ${name} has been ${action.toUpperCase()}.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-heading-md font-semibold tracking-tight text-foreground">
            Group Join Requests
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Review users who scanned your QR invitation or entered your group code.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={currentRequests.length > 0 ? 'warning' : 'success'}>
            {currentRequests.length} Pending Approval
          </Badge>
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

      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-3 font-semibold">User Details</th>
              <th className="pb-3 font-semibold">Requested At</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentRequests.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground">
                  No pending join requests for this group.
                </td>
              </tr>
            ) : (
              currentRequests.map((req) => (
                <tr key={req.id} className="transition-colors hover:bg-surface-muted/50">
                  <td className="py-4">
                    <p className="font-semibold text-foreground">{req.userName}</p>
                    <p className="text-body-xs text-muted-foreground">{req.mobile}</p>
                  </td>
                  <td className="py-4 text-muted-foreground">{req.requestedAt}</td>
                  <td className="py-4">
                    <Badge variant="warning">PENDING</Badge>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(req.id, 'approved', req.userName)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleAction(req.id, 'rejected', req.userName)}
                      >
                        Reject
                      </Button>
                    </div>
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
