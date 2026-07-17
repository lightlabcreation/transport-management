export type MemberStatus = 'online' | 'offline' | 'stale';

export type LiveMapViewState = 'loading' | 'ready' | 'provider-unavailable';

export interface TrackedMember {
  id: string;
  name: string;
  initials: string;
  status: MemberStatus;
  speed: number | null;
  battery: number;
  lastSeen: string;
  distance: string;
  location: string;
  position: { x: number; y: number };
}
