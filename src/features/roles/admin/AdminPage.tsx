import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { MOCK_ADMIN_GROUPS, MOCK_GROUP_MEMBERS, MOCK_JOIN_REQUESTS } from './admin.data';
import { GroupSelectorHeader } from './components/GroupSelectorHeader';
import { GroupMembersDirectory } from './components/GroupMembersDirectory';
import { GroupJoinRequestsQueue } from './components/GroupJoinRequestsQueue';
import { GroupTrackingPoliciesCard } from './components/GroupTrackingPoliciesCard';

export function AdminPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    MOCK_ADMIN_GROUPS[0]?.id || 'grp-001',
  );
  const [activeTab, setActiveTab] = useState<'members' | 'requests' | 'policies'>('members');

  const pendingRequestsCount = MOCK_JOIN_REQUESTS.filter(
    (r) => r.groupId === selectedGroupId && r.status === 'pending',
  ).length;

  return (
    <section aria-labelledby="admin-page-title" className="space-y-6 pb-12">
      <GroupSelectorHeader
        groups={MOCK_ADMIN_GROUPS}
        selectedGroupId={selectedGroupId}
        onSelectGroup={(id) => setSelectedGroupId(id)}
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
        <Button
          size="sm"
          variant={activeTab === 'members' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('members')}
        >
          👥 Group Member Directory
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'requests' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('requests')}
          className="relative"
        >
          ⏳ Join Requests
          {pendingRequestsCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-warning px-2 py-0.5 text-body-xs font-bold text-warning-foreground">
              {pendingRequestsCount}
            </span>
          )}
        </Button>
        <Button
          size="sm"
          variant={activeTab === 'policies' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('policies')}
        >
          ⚙️ Tracking & Privacy Policies
        </Button>
      </div>

      {activeTab === 'members' && (
        <GroupMembersDirectory
          initialMembers={MOCK_GROUP_MEMBERS}
          selectedGroupId={selectedGroupId}
        />
      )}

      {activeTab === 'requests' && (
        <GroupJoinRequestsQueue
          initialRequests={MOCK_JOIN_REQUESTS}
          selectedGroupId={selectedGroupId}
        />
      )}

      {activeTab === 'policies' && (
        <GroupTrackingPoliciesCard
          groups={MOCK_ADMIN_GROUPS}
          selectedGroupId={selectedGroupId}
        />
      )}
    </section>
  );
}
