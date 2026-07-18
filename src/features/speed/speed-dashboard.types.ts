export type SpeedStatus = 'safe' | 'near-limit' | 'over-limit';

export type ViolationSeverity = 'low' | 'medium' | 'high';

export interface CurrentSpeedOverview {
  currentSpeed: number; // in km/h
  speedLimit: number; // in km/h
  status: SpeedStatus;
  lastUpdated: string;
}

export interface SpeedSummaryMetrics {
  averageSpeed: number; // in km/h
  maxSpeed: number; // in km/h
  distanceTracked: number; // in km
  totalDrivingTime: string; // e.g. "4h 12m"
}

export interface DrivingSession {
  id: string;
  label: string; // e.g. "Trip to Sector 62", "Vehicle UP-16-1234"
  averageSpeed: number;
  maxSpeed: number;
  duration: string;
  status: 'completed' | 'active';
}

export interface SpeedViolation {
  id: string;
  recordedSpeed: number;
  allowedLimit: number;
  difference: number;
  timeLabel: string;
  locationLabel: string;
  severity: ViolationSeverity;
}

export interface WeeklySpeedTrendPoint {
  day: string; // e.g. "Mon", "Tue"
  averageSpeed: number;
  maxSpeed: number;
}

export interface SpeedDashboardData {
  overview: CurrentSpeedOverview;
  summary: SpeedSummaryMetrics;
  sessions: DrivingSession[];
  violations: SpeedViolation[];
  trend: WeeklySpeedTrendPoint[];
}

export type DashboardViewState =
  'normal' | 'loading' | 'unavailable' | 'empty-activity' | 'empty-violations' | 'over-limit';
