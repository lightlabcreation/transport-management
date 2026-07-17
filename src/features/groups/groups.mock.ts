import type { Group } from './groups.types';

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
  },

  // Private + Active (2)
  {
    id: 'grp-007',
    name: 'Kiyaan Family Tracker',
    description: 'Private family location sharing group for daily commute and travel safety.',
    visibility: 'private',
    status: 'active',
    memberCount: 5,
    lastUpdated: '2026-07-16T18:00:00Z',
    initials: 'KF',
    category: 'Family',
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
  },
];
