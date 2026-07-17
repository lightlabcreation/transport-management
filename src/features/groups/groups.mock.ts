import type { Group, GroupMember, JoinRequest } from './groups.types';

export const mockMembers: GroupMember[] = [
  {
    id: 'm-001',
    name: 'Nishant Solanki',
    role: 'owner',
    status: 'online',
    lastSeen: 'Active now',
  },
  {
    id: 'm-002',
    name: 'Amit Sharma',
    role: 'admin',
    status: 'offline',
    lastSeen: '2 hours ago',
  },
  {
    id: 'm-003',
    name: 'Rahul Verma',
    role: 'moderator',
    status: 'online',
    lastSeen: 'Active now',
  },
  {
    id: 'm-004',
    name: 'Priya Patel',
    role: 'member',
    status: 'online',
    lastSeen: 'Active now',
  },
  {
    id: 'm-005',
    name: 'Vikram Singh',
    role: 'member',
    status: 'offline',
    lastSeen: 'Yesterday',
  },
  {
    id: 'm-006',
    name: 'Sneha Reddy',
    role: 'guest',
    status: 'offline',
    lastSeen: '3 days ago',
  },
];

export const mockJoinRequests: JoinRequest[] = [
  {
    id: 'jr-001',
    memberName: 'Rajesh Kumar',
    requestedAt: '2026-07-16T14:30:00Z',
    status: 'pending',
  },
  {
    id: 'jr-002',
    memberName: 'Karan Malhotra',
    requestedAt: '2026-07-15T09:15:00Z',
    status: 'pending',
  },
];

/**
 * Fictional deterministic mock data for Groups Directory.
 * No real personal data, coordinates, or tokens.
 * Covers all combinations of visibility × status.
 */
export const mockGroups: Group[] = [
  // Public + Active (3)
  {
    id: 'grp-001',
    name: 'Sunrise Fleet Operations',
    description:
      'Daily logistics coordination for our morning delivery routes across the northern district.',
    visibility: 'public',
    status: 'active',
    memberCount: 24,
    lastUpdated: '2026-07-14T08:30:00Z',
    initials: 'SF',
    category: 'Fleet',
    trackingPolicy: 'High Frequency GPS tracking (every 10 seconds) during active shifts.',
    visibilityPolicy: 'Only approved members of the fleet can view real-time location.',
    members: mockMembers,
    joinRequests: mockJoinRequests,
  },
  {
    id: 'grp-002',
    name: 'City School Bus Network',
    description: 'Real-time tracking and safety coordination for school bus drivers and parents.',
    visibility: 'public',
    status: 'active',
    memberCount: 112,
    lastUpdated: '2026-07-15T11:00:00Z',
    initials: 'CS',
    category: 'School',
    trackingPolicy:
      'Active tracking during scheduled route periods only (7 AM - 9 AM, 2 PM - 5 PM).',
    visibilityPolicy:
      'Shared view enabled for verified parent tokens. Public coordinates are obfuscated.',
    members: mockMembers,
    joinRequests: [],
  },
  {
    id: 'grp-003',
    name: 'Riverside Cycling Club',
    description:
      'Weekend cycling group for enthusiasts exploring riverside trails and city circuits.',
    visibility: 'public',
    status: 'active',
    memberCount: 38,
    lastUpdated: '2026-07-13T16:45:00Z',
    initials: 'RC',
    category: 'Recreation',
    trackingPolicy:
      'Opt-in trip sharing during active events only. No continuous background tracking.',
    visibilityPolicy:
      'Open tracking list visible to all members. Non-members see starting and ending hubs.',
    members: mockMembers.slice(2), // fewer members
    joinRequests: mockJoinRequests.slice(0, 1),
  },

  // Public + Pending (2)
  {
    id: 'grp-004',
    name: 'Metro Delivery Partners',
    description: 'Coordination hub for independent delivery partners operating in the metro area.',
    visibility: 'public',
    status: 'pending',
    memberCount: 7,
    lastUpdated: '2026-07-16T09:15:00Z',
    initials: 'MD',
    category: 'Delivery',
    trackingPolicy: 'Standard commercial telemetry tracking while on-duty.',
    visibilityPolicy: 'Restricted to registered dispatch managers.',
    members: mockMembers,
    joinRequests: mockJoinRequests,
  },
  {
    id: 'grp-005',
    name: 'Community Road Watch',
    description: 'Neighborhood safety and road hazard reporting group for local residents.',
    visibility: 'public',
    status: 'pending',
    memberCount: 15,
    lastUpdated: '2026-07-12T14:00:00Z',
    initials: 'CR',
    category: 'Safety',
    trackingPolicy: 'No active telemetry tracking. Static manual hazard pin drops only.',
    visibilityPolicy: 'Public display of pins on community map dashboard.',
    members: mockMembers.slice(3),
    joinRequests: [],
  },

  // Public + Suspended (1)
  {
    id: 'grp-006',
    name: 'Old Town Tour Guides',
    description: 'Historic district guided tour coordination — currently under platform review.',
    visibility: 'public',
    status: 'suspended',
    memberCount: 9,
    lastUpdated: '2026-07-01T10:00:00Z',
    initials: 'OT',
    category: 'Tourism',
    trackingPolicy: 'Telemetry deactivated due to account suspension.',
    visibilityPolicy: 'All tracking views blocked during review.',
    members: mockMembers,
    joinRequests: [],
  },

  // Private + Active (2)
  {
    id: 'grp-007',
    name: 'Kiyaan Family Tracker',
    description: 'Private location sharing group for family members to stay safe during commutes.',
    visibility: 'private',
    status: 'active',
    memberCount: 5,
    lastUpdated: '2026-07-16T18:00:00Z',
    initials: 'KF',
    category: 'Family',
    trackingPolicy: 'Continuous low-power geofencing and battery-efficient location tracking.',
    visibilityPolicy: 'Strictly restricted. No external or public visibility allowed.',
    members: mockMembers.slice(0, 4),
    joinRequests: [],
  },
  {
    id: 'grp-008',
    name: 'Executive Security Detail',
    description: 'Private coordination for executive transport and on-ground security teams.',
    visibility: 'private',
    status: 'active',
    memberCount: 12,
    lastUpdated: '2026-07-15T07:30:00Z',
    initials: 'ES',
    category: 'Security',
    trackingPolicy: 'Encrypted tactical location updates every 5 seconds.',
    visibilityPolicy: 'Confidential military-grade access encryption. Operations room access only.',
    members: mockMembers,
    joinRequests: mockJoinRequests,
  },

  // Private + Pending (2)
  {
    id: 'grp-009',
    name: 'Westpark Construction Crew',
    description: 'Internal fleet and crew tracking for Westpark infrastructure project phase 2.',
    visibility: 'private',
    status: 'pending',
    memberCount: 31,
    lastUpdated: '2026-07-16T12:00:00Z',
    initials: 'WC',
    category: 'Construction',
    trackingPolicy: 'Heavy machinery and operations geofencing.',
    visibilityPolicy: 'Project supervisor access list only.',
    members: mockMembers,
    joinRequests: [],
  },
  {
    id: 'grp-010',
    name: 'Harbour Freight Logistics',
    description: 'Shipment tracking and driver coordination for port freight operations.',
    visibility: 'private',
    status: 'pending',
    memberCount: 19,
    lastUpdated: '2026-07-10T09:45:00Z',
    initials: 'HF',
    category: 'Logistics',
    trackingPolicy: 'Interstate transport logging and fuel monitoring telemetry.',
    visibilityPolicy: 'Logistics dispatcher tracking console.',
    members: mockMembers,
    joinRequests: mockJoinRequests,
  },

  // Private + Suspended (2)
  {
    id: 'grp-011',
    name: 'Nightshift Patrol Alpha',
    description: 'Night security patrol coordination — account under compliance review.',
    visibility: 'private',
    status: 'suspended',
    memberCount: 8,
    lastUpdated: '2026-06-28T22:00:00Z',
    initials: 'NP',
    category: 'Security',
    trackingPolicy: 'Suspended.',
    visibilityPolicy: 'Deactivated.',
    members: mockMembers,
    joinRequests: [],
  },
  {
    id: 'grp-012',
    name: 'Summit Events Transport',
    description:
      'Event-day transport management for the annual summit — suspended pending resubmission.',
    visibility: 'private',
    status: 'suspended',
    memberCount: 3,
    lastUpdated: '2026-06-15T13:30:00Z',
    initials: 'SE',
    category: 'Events',
    trackingPolicy: 'Inactive.',
    visibilityPolicy: 'Inactive.',
    members: mockMembers,
    joinRequests: [],
  },
];
