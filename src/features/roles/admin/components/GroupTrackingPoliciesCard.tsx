import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GroupAdminSummary } from '../admin.types';

interface GroupTrackingPoliciesCardProps {
  groups: GroupAdminSummary[];
  selectedGroupId: string;
}

export function GroupTrackingPoliciesCard({
  groups,
  selectedGroupId,
}: GroupTrackingPoliciesCardProps) {
  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const [policy, setPolicy] = useState<'Continuous' | 'Optional'>(
    currentGroup?.trackingPolicy || 'Continuous',
  );
  const [visibility, setVisibility] = useState<'Everyone' | 'Only Admin' | 'Nearby Only'>(
    currentGroup?.visibilityRule || 'Everyone',
  );
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setSaveMessage('Tracking & privacy policies updated and broadcasted to all group members.');
    setTimeout(() => setSaveMessage(''), 4000);
  };

  if (!currentGroup) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-heading-md font-semibold tracking-tight text-foreground">
            Group Tracking Policy & Privacy Rules
          </h2>
          <p className="text-body-sm text-muted-foreground">
            Configure how GPS telemetry is captured and who can view live member coordinates.
          </p>
        </div>
        <Badge variant={policy === 'Continuous' ? 'danger' : 'neutral'}>
          {policy.toUpperCase()} TRACKING
        </Badge>
      </div>

      {saveMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-success/30 bg-success/10 p-3 text-body-sm font-medium text-success"
        >
          {saveMessage}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <h3 className="text-body font-semibold text-foreground">GPS Capture Mode</h3>
          <p className="text-body-xs text-muted-foreground">
            Continuous mode requires active background GPS, ideal for commercial fleet & delivery. Optional allows members to turn off location sharing off-hours.
          </p>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant={policy === 'Continuous' ? 'primary' : 'outline'}
              onClick={() => setPolicy('Continuous')}
            >
              Continuous Tracking
            </Button>
            <Button
              size="sm"
              variant={policy === 'Optional' ? 'primary' : 'outline'}
              onClick={() => setPolicy('Optional')}
            >
              Optional (On-Demand)
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
          <h3 className="text-body font-semibold text-foreground">Member Visibility Rule</h3>
          <p className="text-body-xs text-muted-foreground">
            Control whether members see each other on the live map or if telemetry is strictly private to admins and supervisors.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              variant={visibility === 'Everyone' ? 'primary' : 'outline'}
              onClick={() => setVisibility('Everyone')}
            >
              Everyone (Peer-to-Peer)
            </Button>
            <Button
              size="sm"
              variant={visibility === 'Only Admin' ? 'primary' : 'outline'}
              onClick={() => setVisibility('Only Admin')}
            >
              Admins Only
            </Button>
            <Button
              size="sm"
              variant={visibility === 'Nearby Only' ? 'primary' : 'outline'}
              onClick={() => setVisibility('Nearby Only')}
            >
              Nearby (Under 5 km)
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>Save & Broadcast Policy</Button>
      </div>
    </div>
  );
}
