import type { DemoAccessProfile, DemoAccessProfileId } from '@/features/access-control';

import type { DashboardCapabilities, DashboardPresentation } from './dashboard.types';

const capabilities: Record<DemoAccessProfileId, DashboardCapabilities> = {
  'group-owner': {
    canViewTrips: true,
    canManageMembers: true,
    canApproveRequests: true,
    canReviewAlerts: true,
    canUseManagementShortcuts: true,
    isReadOnly: false,
  },
  'delegated-group-administrator': {
    canViewTrips: true,
    canManageMembers: true,
    canApproveRequests: true,
    canReviewAlerts: true,
    canUseManagementShortcuts: true,
    isReadOnly: false,
  },
  'group-admin': {
    canViewTrips: true,
    canManageMembers: true,
    canApproveRequests: true,
    canReviewAlerts: true,
    canUseManagementShortcuts: true,
    isReadOnly: false,
  },
  moderator: {
    canViewTrips: false,
    canManageMembers: false,
    canApproveRequests: false,
    canReviewAlerts: true,
    canUseManagementShortcuts: false,
    isReadOnly: false,
  },
  member: {
    canViewTrips: true,
    canManageMembers: false,
    canApproveRequests: false,
    canReviewAlerts: false,
    canUseManagementShortcuts: false,
    isReadOnly: false,
  },
  'group-guest': {
    canViewTrips: false,
    canManageMembers: false,
    canApproveRequests: false,
    canReviewAlerts: false,
    canUseManagementShortcuts: false,
    isReadOnly: true,
  },
};

const presentations: Record<DemoAccessProfileId, Omit<DashboardPresentation, 'capabilities'>> = {
  'group-owner': {
    profileId: 'group-owner',
    profileName: 'Platform Owner',
    eyebrow: 'Complete group overview',
    heading: 'Platform Owner dashboard',
    description: 'Monitor group health, member activity, trips, and tracking from one preview.',
    summaryLabel: 'Owner summary',
    metrics: [
      { label: 'Total Members', value: '248', detail: 'Across 12 groups' },
      { label: 'Active Groups', value: '12', detail: '10 tracking now' },
      { label: 'Trips Today', value: '42', detail: '18 completed' },
      { label: 'Tracking Online', value: '94%', detail: '233 members available' },
    ],
    focusHeading: 'Management overview',
    focusItems: ['8 pending join requests', '3 tracking alerts', '2 group reviews due'],
    recentHeading: 'Recent group trips',
    activityHeading: 'Recent member activity',
    quickActions: ['Manage Members', 'Review Requests', 'Create Group', 'Export Reports'],
  },
  'delegated-group-administrator': {
    profileId: 'delegated-group-administrator',
    profileName: 'Admin Assistant',
    eyebrow: 'Delegated operations',
    heading: 'Admin Assistant dashboard',
    description: 'Focus on assigned groups and explicitly delegated operational responsibilities.',
    summaryLabel: 'Delegated administration summary',
    metrics: [
      { label: 'Assigned Groups', value: '6', detail: '5 active now' },
      { label: 'Member Activity', value: '38', detail: 'Updates today' },
      { label: 'Pending Requests', value: '8', detail: 'Awaiting review' },
      { label: 'Operations', value: 'Healthy', detail: '1 item needs attention' },
    ],
    focusHeading: 'Assigned operations',
    focusItems: ['Review delegated requests', 'Monitor assigned groups', 'Check member activity'],
    recentHeading: 'Assigned group trips',
    activityHeading: 'Member activity',
    quickActions: ['View Assigned Groups', 'Review Member Activity', 'Review Requests'],
  },
  'group-admin': {
    profileId: 'group-admin',
    profileName: 'Fleet Admin',
    eyebrow: 'Group operations',
    heading: 'Fleet Admin dashboard',
    description: 'Coordinate active trips, group members, tracking, and moderation previews.',
    summaryLabel: 'Administration summary',
    metrics: [
      { label: 'Group Members', value: '86', detail: '79 currently active' },
      { label: 'Active Trips', value: '17', detail: 'Across assigned groups' },
      { label: 'Tracking Summary', value: '74 online', detail: '12 unavailable' },
      { label: 'Open Reviews', value: '5', detail: 'Moderation items' },
    ],
    focusHeading: 'Administration focus',
    focusItems: ['Monitor active trips', 'Review member status', 'Check moderation activity'],
    recentHeading: 'Recent active trips',
    activityHeading: 'Member operations',
    quickActions: ['Manage Members', 'View Active Trips', 'Open Tracking', 'Moderation Tools'],
  },
  moderator: {
    profileId: 'moderator',
    profileName: 'Safety Moderator',
    eyebrow: 'Review and monitoring',
    heading: 'Moderator dashboard',
    description: 'Review requests, reports, alerts, and recent activity within the demo scope.',
    summaryLabel: 'Moderation summary',
    metrics: [
      { label: 'Reports', value: '12', detail: '4 new today' },
      { label: 'Requests', value: '8', detail: 'Pending review' },
      { label: 'Alerts', value: '3', detail: 'Require attention' },
      { label: 'Activity Reviews', value: '14', detail: 'Completed today' },
    ],
    focusHeading: 'Review queue',
    focusItems: ['8 membership requests', '3 safety alerts', '4 new reports'],
    recentHeading: 'Recent reports',
    activityHeading: 'Activity review',
    quickActions: ['Review Reports', 'Review Requests', 'Review Alerts', 'Activity Review'],
  },
  member: {
    profileId: 'member',
    profileName: 'Active Driver',
    eyebrow: 'Personal activity',
    heading: 'Active Driver dashboard',
    description: 'See your own trips, tracking status, activity, and alerts in one place.',
    summaryLabel: 'Personal summary',
    metrics: [
      { label: 'My Activity', value: '7', detail: 'Updates this week' },
      { label: 'My Trips', value: '4', detail: '2 completed today' },
      { label: 'My Tracking Status', value: 'Sharing', detail: 'Demo location active' },
      { label: 'My Alerts', value: '2', detail: 'One unread' },
    ],
    focusHeading: 'My overview',
    focusItems: ['Tracking is simulated', 'Next trip at 4:30 PM', 'One unread speed alert'],
    recentHeading: 'My recent trips',
    activityHeading: 'My recent activity',
    quickActions: ['View My Trips', 'Open Live Map', 'Review My Alerts'],
  },
  'group-guest': {
    profileId: 'group-guest',
    profileName: 'Guest Viewer',
    eyebrow: 'Limited access',
    heading: 'Guest Viewer dashboard',
    description: 'View the limited information currently shared with this demo guest profile.',
    summaryLabel: 'Guest summary',
    metrics: [
      { label: 'Visible Groups', value: '1', detail: 'Read-only access' },
      { label: 'Shared Updates', value: '5', detail: 'General information' },
      { label: 'Tracking Access', value: 'Limited', detail: 'Live details restricted' },
      { label: 'Available Actions', value: 'Read only', detail: 'No management actions' },
    ],
    focusHeading: 'Shared information',
    focusItems: ['Group overview available', 'General updates visible', 'Actions are restricted'],
    recentHeading: 'Recent shared information',
    activityHeading: 'Shared activity',
    quickActions: [],
    restrictedMessage:
      'This guest preview is read-only. Management, request, trip, and member actions are restricted.',
  },
};

const missingProfileCapabilities: DashboardCapabilities = {
  canViewTrips: false,
  canManageMembers: false,
  canApproveRequests: false,
  canReviewAlerts: false,
  canUseManagementShortcuts: false,
  isReadOnly: true,
};

export function getDashboardPresentation(profile: DemoAccessProfile | null): DashboardPresentation {
  if (!profile) {
    return {
      profileId: 'missing',
      profileName: 'Profile unavailable',
      eyebrow: 'Limited access',
      heading: 'Dashboard preview unavailable',
      description: 'Choose a valid demo access profile before viewing role-specific information.',
      summaryLabel: 'Safe fallback summary',
      metrics: [],
      focusHeading: 'No profile selected',
      focusItems: [],
      recentHeading: 'Recent information',
      activityHeading: 'Activity',
      quickActions: [],
      capabilities: missingProfileCapabilities,
      restrictedMessage: 'No demo profile is available. Return to the access selector to continue.',
    };
  }

  return { ...presentations[profile.id], capabilities: capabilities[profile.id] };
}

export function getDashboardCapabilities(profileId: DemoAccessProfileId) {
  return capabilities[profileId];
}
