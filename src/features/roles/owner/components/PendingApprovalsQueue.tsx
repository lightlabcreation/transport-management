import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { pendingGroupsStore } from '@/features/groups/pending-groups.store';
import type { PendingGroupApproval } from '../owner.types';

interface PendingApprovalsQueueProps {
  initialApprovals: PendingGroupApproval[];
}

export function PendingApprovalsQueue({ initialApprovals }: PendingApprovalsQueueProps) {
  // Lazy initializer: merge sessionStorage user-created groups with mock data on first mount
  const [approvals, setApprovals] = useState<PendingGroupApproval[]>(() => {
    const storeItems = pendingGroupsStore.getAll();
    const existingIds = new Set(initialApprovals.map((a) => a.id));
    const newFromStore = storeItems.filter((a) => !existingIds.has(a.id));
    return [...newFromStore, ...initialApprovals];
  });

  // Sync effect: if component was already mounted, pick up any groups added after mount
  useEffect(() => {
    const storeItems = pendingGroupsStore.getAll();
    setApprovals((prev) => {
      const existingIds = new Set(prev.map((a) => a.id));
      const newItems = storeItems.filter((a) => !existingIds.has(a.id));
      if (newItems.length === 0) return prev;
      return [...newItems, ...prev];
    });
  }, []);

  const [viewItem, setViewItem] = useState<PendingGroupApproval | null>(null);
  const [actionModal, setActionModal] = useState<{ item: PendingGroupApproval; action: 'approve' | 'reject' } | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  function handleConfirmAction() {
    if (!actionModal) return;
    const { item, action } = actionModal;
    const newStatus = action === 'approve' ? 'approved' : 'rejected';

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === item.id
          ? {
              ...a,
              status: newStatus,
              notes: adminNote ? `${a.notes || ''} [Admin Note: ${adminNote}]` : a.notes,
            }
          : a,
      ),
    );

    setStatusMessage(
      `Group "${item.groupName}" has been ${newStatus.toUpperCase()} successfully.`,
    );
    setActionModal(null);
    setViewItem(null);
    setAdminNote('');
    setTimeout(() => setStatusMessage(''), 5000);
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* ── Section Heading ─────────────────────────────────── */}
      <div className="flex flex-col gap-3 border-b border-border bg-surface px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-body-xs font-bold uppercase tracking-widest text-primary">
            Platform Administration
          </p>
          <h2 className="mt-0.5 text-heading-sm font-bold tracking-tight text-foreground">
            Pending Group Approvals
          </h2>
          <p className="mt-0.5 text-body-xs text-muted-foreground">
            Review newly requested groups waiting for platform clearance before going live.
          </p>
        </div>
        <Badge variant={pendingCount > 0 ? 'warning' : 'success'} className="self-start sm:self-center shrink-0">
          {pendingCount} Pending Review
        </Badge>
      </div>

      {/* ── Status Toast ─────────────────────────────────────── */}
      {statusMessage && (
        <div
          role="status"
          className="mx-6 mt-4 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-body-sm font-medium text-success"
        >
          ✅ {statusMessage}
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="overflow-x-auto px-2">
        <table className="w-full min-w-[780px] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-body-xs uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-body-xs uppercase tracking-wider w-[28%]">
                Group Name
              </th>
              <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-body-xs uppercase tracking-wider">
                Category &amp; Privacy
              </th>
              <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-body-xs uppercase tracking-wider">
                Requested By
              </th>
              <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-body-xs uppercase tracking-wider">
                Members
              </th>
              <th className="px-4 py-3 font-semibold text-muted-foreground whitespace-nowrap text-body-xs uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right font-semibold text-muted-foreground whitespace-nowrap text-body-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {approvals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground text-body-sm">
                  No pending group approvals right now.
                </td>
              </tr>
            ) : (
              approvals.map((item, index) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-surface-muted/40"
                >
                  {/* # */}
                  <td className="px-4 py-3 align-middle text-muted-foreground font-mono text-body-xs">
                    {String(index + 1).padStart(2, '0')}
                  </td>

                  {/* Group Name */}
                  <td className="px-4 py-3 align-middle">
                    <p className="font-semibold text-foreground leading-snug">{item.groupName}</p>
                    {item.notes && (
                      <p className="mt-0.5 text-body-xs text-muted-foreground leading-snug line-clamp-2 max-w-[200px]">
                        {item.notes}
                      </p>
                    )}
                  </td>

                  {/* Category & Privacy */}
                  <td className="px-4 py-3 align-middle">
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="neutral">{item.category}</Badge>
                      <Badge variant={item.privacy === 'Public' ? 'info' : 'outline'}>
                        {item.privacy}
                      </Badge>
                    </div>
                  </td>

                  {/* Requested By */}
                  <td className="px-4 py-3 align-middle whitespace-nowrap">
                    <p className="font-medium text-foreground">{item.requestedBy}</p>
                    <p className="text-body-xs text-muted-foreground">{item.mobile}</p>
                    <p className="text-body-xs text-muted-foreground">{item.requestedAt}</p>
                  </td>

                  {/* Members */}
                  <td className="px-4 py-3 align-middle whitespace-nowrap font-semibold text-foreground">
                    {item.initialMembersCount}
                    <span className="ml-1 font-normal text-muted-foreground text-body-xs">users</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 align-middle">
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

                  {/* Actions */}
                  <td className="px-4 py-3 align-middle text-right">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {/* View button — always visible */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setViewItem(item)}
                      >
                        View
                      </Button>
                      {item.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setActionModal({ item, action: 'approve' })}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setActionModal({ item, action: 'reject' })}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {item.status !== 'pending' && (
                        <span className="text-body-xs text-muted-foreground font-medium">
                          Processed
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── View Details Modal ───────────────────────────────── */}
      {viewItem && (
        <div
          role="dialog"
          aria-labelledby="view-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setViewItem(null); }}
        >
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border bg-surface px-6 py-4">
              <div>
                <p className="text-body-xs font-bold uppercase tracking-widest text-primary">
                  Group Request Details
                </p>
                <h3 id="view-modal-title" className="mt-0.5 text-heading-sm font-bold text-foreground">
                  {viewItem.groupName}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setViewItem(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-surface-muted hover:text-foreground transition-colors"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    viewItem.status === 'approved'
                      ? 'success'
                      : viewItem.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {viewItem.status.toUpperCase()}
                </Badge>
                <Badge variant={viewItem.privacy === 'Public' ? 'info' : 'outline'}>
                  {viewItem.privacy}
                </Badge>
                <Badge variant="neutral">{viewItem.category}</Badge>
              </div>

              {/* Detail Grid */}
              <dl className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Group Name', value: viewItem.groupName },
                  { label: 'Category', value: viewItem.category },
                  { label: 'Privacy', value: viewItem.privacy },
                  { label: 'Members', value: `${viewItem.initialMembersCount} users` },
                  { label: 'Requested By', value: viewItem.requestedBy },
                  { label: 'Contact', value: viewItem.mobile },
                  { label: 'Requested', value: viewItem.requestedAt },
                  { label: 'Status', value: viewItem.status.toUpperCase() },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-surface-muted px-4 py-3">
                    <dt className="text-body-xs text-muted-foreground font-medium">{label}</dt>
                    <dd className="mt-0.5 text-body-sm font-semibold text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>

              {/* Notes */}
              {viewItem.notes && (
                <div className="rounded-lg border border-border bg-surface px-4 py-3">
                  <p className="text-body-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Group Description / Notes
                  </p>
                  <p className="text-body-sm text-foreground leading-relaxed">{viewItem.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-surface px-6 py-4">
              <Button variant="ghost" onClick={() => setViewItem(null)}>
                Close
              </Button>
              {viewItem.status === 'pending' && (
                <>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setViewItem(null);
                      setActionModal({ item: viewItem, action: 'reject' });
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setViewItem(null);
                      setActionModal({ item: viewItem, action: 'approve' });
                    }}
                  >
                    Approve Group
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Approve / Reject Confirm Modal ───────────────────── */}
      {actionModal && (
        <div
          role="dialog"
          aria-labelledby="action-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h3 id="action-modal-title" className="text-heading-sm font-bold text-foreground">
              {actionModal.action === 'approve' ? '✅ Approve Group Request' : '❌ Reject Group Request'}
            </h3>
            <p className="mt-2 text-body-sm text-muted-foreground">
              You are about to{' '}
              <strong className={actionModal.action === 'approve' ? 'text-success' : 'text-danger'}>
                {actionModal.action.toUpperCase()}
              </strong>{' '}
              the group <strong>"{actionModal.item.groupName}"</strong> requested by{' '}
              {actionModal.item.requestedBy}.
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
                  setActionModal(null);
                  setAdminNote('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant={actionModal.action === 'approve' ? 'primary' : 'danger'}
                onClick={handleConfirmAction}
              >
                Confirm {actionModal.action === 'approve' ? 'Approval' : 'Rejection'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
