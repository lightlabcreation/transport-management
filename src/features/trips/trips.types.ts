export interface TripRecord {
  id: string;
  routeLabel: string;
  driverLabel: string;
  vehicleLabel: string;
  startTime: string;
  endTime: string;
  date: string;
  distance: number;
  duration: string;
  avgSpeed: number;
  maxSpeed: number;
  status: 'completed' | 'active' | 'scheduled';
}

export const TRIPS_VIEW_STATES = ['normal', 'loading', 'empty'] as const;
export type TripsViewState = (typeof TRIPS_VIEW_STATES)[number];
