export interface RouteOption {
  id: string;
  name: string;
  distance: number;
  duration: string;
  trafficStatus: 'light' | 'moderate' | 'heavy';
  roadHazard: string | null;
}

export const NAVIGATION_VIEW_STATES = ['normal', 'loading', 'no-route', 'unavailable'] as const;
export type NavigationViewState = (typeof NAVIGATION_VIEW_STATES)[number];

export interface RecentDestination {
  id: string;
  label: string;
  origin: string;
  destination: string;
}
