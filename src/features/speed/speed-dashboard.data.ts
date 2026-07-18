import type { SpeedDashboardData } from './speed-dashboard.types';

export const MOCK_NORMAL_DATA: SpeedDashboardData = {
  overview: {
    currentSpeed: 72,
    speedLimit: 80,
    status: 'safe',
    lastUpdated: '10 seconds ago',
  },
  summary: {
    averageSpeed: 52.4,
    maxSpeed: 84.0,
    distanceTracked: 145.2,
    totalDrivingTime: '2h 45m',
  },
  sessions: [
    {
      id: 'session-1',
      label: 'Express Highway Route',
      averageSpeed: 68.5,
      maxSpeed: 84.0,
      duration: '1h 15m',
      status: 'completed',
    },
    {
      id: 'session-2',
      label: 'Local Delivery Loop',
      averageSpeed: 42.1,
      maxSpeed: 65.0,
      duration: '45m',
      status: 'completed',
    },
    {
      id: 'session-3',
      label: 'Morning Shift - Driver Route',
      averageSpeed: 38.0,
      maxSpeed: 50.0,
      duration: '45m',
      status: 'completed',
    },
  ],
  violations: [
    {
      id: 'violation-1',
      recordedSpeed: 84,
      allowedLimit: 80,
      difference: 4,
      timeLabel: '10:45 AM',
      locationLabel: 'Highway Junction (Sec-62)',
      severity: 'low',
    },
    {
      id: 'violation-2',
      recordedSpeed: 62,
      allowedLimit: 50,
      difference: 12,
      timeLabel: '09:15 AM',
      locationLabel: 'School Zone Main Road',
      severity: 'medium',
    },
    {
      id: 'violation-3',
      recordedSpeed: 95,
      allowedLimit: 70,
      difference: 25,
      timeLabel: 'Yesterday, 04:30 PM',
      locationLabel: 'Outer Bypass Bypass Rd',
      severity: 'high',
    },
  ],
  trend: [
    { day: 'Mon', averageSpeed: 48, maxSpeed: 75 },
    { day: 'Tue', averageSpeed: 55, maxSpeed: 84 },
    { day: 'Wed', averageSpeed: 52, maxSpeed: 80 },
    { day: 'Thu', averageSpeed: 60, maxSpeed: 95 },
    { day: 'Fri', averageSpeed: 50, maxSpeed: 78 },
    { day: 'Sat', averageSpeed: 45, maxSpeed: 70 },
    { day: 'Sun', averageSpeed: 40, maxSpeed: 65 },
  ],
};

export const MOCK_OVER_LIMIT_DATA: SpeedDashboardData = {
  ...MOCK_NORMAL_DATA,
  overview: {
    currentSpeed: 95,
    speedLimit: 80,
    status: 'over-limit',
    lastUpdated: 'Just now',
  },
};

export const MOCK_EMPTY_ACTIVITY_DATA: SpeedDashboardData = {
  ...MOCK_NORMAL_DATA,
  summary: {
    averageSpeed: 0,
    maxSpeed: 0,
    distanceTracked: 0,
    totalDrivingTime: '0h 0m',
  },
  sessions: [],
};

export const MOCK_EMPTY_VIOLATIONS_DATA: SpeedDashboardData = {
  ...MOCK_NORMAL_DATA,
  violations: [],
};
