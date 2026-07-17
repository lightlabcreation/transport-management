import type { JoinRequest, GroupCapability } from '../groups.types';
import { Button } from '@/components/ui/button';

interface JoinRequestsPanelProps {
  requests: JoinRequest[];
  viewerCapabilities: GroupCapability[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onActionTriggered: (message: string) => void;
}

export function JoinRequestsPanel({
  requests,
  viewerCapabilities,
  onApprove,
  onReject,
  onActionTriggered,
}: JoinRequestsPanelProps) {
  const canApprove = viewerCapabilities.includes('approve_join_requests');
  const canReject = viewerCapabilities.includes('reject_join_requests');

  function formatDate(isoString: string) {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Recent';
    }
  }

  function handleApprove(request: JoinRequest) {
    onApprove(request.id);
    onActionTriggered(`Simulated: Join request for "${request.memberName}" was approved.`);
  }

  function handleReject(request: JoinRequest) {
    onReject(request.id);
    onActionTriggered(`Simulated: Join request for "${request.memberName}" was rejected.`);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-body-md font-bold text-foreground">Join Requests</h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-body-xs font-semibold text-primary">
          {requests.filter((r) => r.status === 'pending').length} Pending
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <p className="text-body-sm">No pending join requests.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border" aria-label="Pending join requests">
          {requests.map((request) => (
            <li
              key={request.id}
              className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-foreground text-body-sm">{request.memberName}</p>
                <p className="text-body-xs text-muted-foreground">
                  Requested on {formatDate(request.requestedAt)}
                </p>
                {request.status !== 'pending' && (
                  <span
                    className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-wider ${
                      request.status === 'approved' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {request.status}
                  </span>
                )}
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                    disabled={!canApprove}
                    onClick={() => handleApprove(request)}
                    aria-label={`Approve join request from ${request.memberName}`}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-500 hover:bg-red-50"
                    disabled={!canReject}
                    onClick={() => handleReject(request)}
                    aria-label={`Reject join request from ${request.memberName}`}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
