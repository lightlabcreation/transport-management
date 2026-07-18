import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PendingGroupApproval } from '../owner.types';

interface PendingApprovalsQueueProps {
  initialApprovals: PendingGroupApproval[];
}

export function PendingApprovalsQueue({ initialApprovals }: PendingApprovalsQueueProps) {
  const [approvals, setApprovals] = useState<PendingGroupApproval[]>(initialApprovals);
  const [selectedApproval, setSelectedApproval] = useState<PendingGroupApproval | null>(null);
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleOpenAction = (approval: PendingGroupApproval, action: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setModalAction(action);
    setAdminNote('');
  };

  const handleConfirmAction = () => {
    if (!selectedApproval || !modalAction) return;

    const newStatus = modalAction === 'approve' ? 'approved' : 'rejected';
    setApprovals((prev) =>
      prev.map((item) =>
        item.id === selectedApproval.id
          ? {
              ...item,
              status: newStatus,
              notes: adminNote ? `${item.notes || ''} [Admin Note: ${adminNote}]` : item.notes,
            }
          : item,
      ),
    );

    setStatusMessage(
      `Group "${selectedApproval.groupName}" has been successfully ${newStatus.toUpperCase()}.`,
    );
    setSelectedApproval(null);
    setModalAction(null);

    setTimeout(() => {
      setStatusMessage('');
    }, 5000);
  };

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-heading-md font-semibold tracking-tight text-foreground">
            Pending Group Approvals
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Review newly requested private and public groups waiting for platform clearance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={pendingCount > 0 ? 'warning' : 'success'}>
            {pendingCount} Pending Review
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
              <th className="pb-3 font-semibold">Group Details</th>
              <th className="pb-3 font-semibold">Category & Privacy</th>
              <th className="pb-3 font-semibold">Requested By</th>
              <th className="pb-3 font-semibold">Members</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {approvals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">
                  No pending group approvals right now.
                </td>
              </tr>
            ) : (
              approvals.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-surface-muted/50">
                  <td className="py-4">
                    <p className="font-semibold text-foreground">{item.groupName}</p>
                    {item.notes && (
                      <p className="mt-0.5 max-w-xs text-body-xs text-muted-foreground">
                        {item.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral">{item.category}</Badge>
                      <Badge variant={item.privacy === 'Public' ? 'info' : 'outline'}>
                        {item.privacy}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="font-medium text-foreground">{item.requestedBy}</p>
                    <p className="text-body-xs text-muted-foreground">{item.mobile}</p>
                    <p className="text-body-xs text-muted-foreground">{item.requestedAt}</p>
                  </td>
                  <td className="py-4 font-medium text-foreground">
                    {item.initialMembersCount} users
                  </td>
                  <td className="py-4">
                    <Badge
                      variant={
                        item.status === 'approved'
                          ? 'success'
                          : item.status === 'rejected'
                            ? 'danger'
                            : 'warning'
                      }
                    >
                      {item.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    {item.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenAction(item, 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleOpenAction(item, 'reject')}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-body-xs text-muted-foreground font-medium">
                        Processed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedApproval && modalAction && (
        <div
          role="dialog"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg">
            <h3 id="modal-title" className="text-heading-sm font-semibold text-foreground">
              {modalAction === 'approve' ? 'Approve Group Request' : 'Reject Group Request'}
            </h3>
            <p className="mt-2 text-body-sm text-muted-foreground">
              You are about to {modalAction} <strong>{selectedApproval.groupName}</strong> requested
              by {selectedApproval.requestedBy}.
            </p>
            <div className="mt-4 space-y-2">
              <label htmlFor="admin-note" className="block text-body-xs font-semibold text-foreground">
                Optional Audit Note (Visible to Admins)
              </label>
              <Input
                id="admin-note"
                placeholder="e.g. Verified commercial license / Missing fleet ID..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedApproval(null);
                  setModalAction(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant={modalAction === 'approve' ? 'primary' : 'danger'}
                onClick={handleConfirmAction}
              >
                Confirm {modalAction === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
