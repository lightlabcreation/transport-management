import type { PerformanceMetric, TrendPoint, ReportPeriod, ReportType } from './reports.types';

export const MOCK_METRICS: Record<ReportPeriod, Record<ReportType, PerformanceMetric[]>> = {
  daily: {
    trips: [
      { label: 'Completed Trips', value: 12, change: '+2 vs yesterday', isPositive: true },
      { label: 'Total Distance', value: '185 km', change: '+12% vs yesterday', isPositive: true },
      { label: 'Active Drivers', value: 8, change: 'Same as yesterday', isPositive: true },
      {
        label: 'Avg Trip Time',
        value: '38 mins',
        change: '-4 mins vs yesterday',
        isPositive: true,
      },
    ],
    speed: [
      {
        label: 'Average Speed',
        value: '44 km/h',
        change: '-2 km/h vs yesterday',
        isPositive: true,
      },
      {
        label: 'Max Speed Recorded',
        value: '72 km/h',
        change: '84 km/h yesterday',
        isPositive: true,
      },
      { label: 'Compliance Score', value: '98.5%', change: '+0.5% vs yesterday', isPositive: true },
      {
        label: 'Over-speed Duration',
        value: '1.2 mins',
        change: '-0.8 mins vs yesterday',
        isPositive: true,
      },
    ],
    alerts: [
      { label: 'Total Alert Logs', value: 4, change: '-3 vs yesterday', isPositive: true },
      { label: 'High Priority Alerts', value: 1, change: '-1 vs yesterday', isPositive: true },
      { label: 'Resolved Alerts', value: 3, change: '+1 vs yesterday', isPositive: true },
      {
        label: 'Avg Response Time',
        value: '4.5 mins',
        change: '-1.5 mins vs yesterday',
        isPositive: true,
      },
    ],
  },
  weekly: {
    trips: [
      { label: 'Completed Trips', value: 84, change: '+8% vs last week', isPositive: true },
      { label: 'Total Distance', value: '1,245 km', change: '+10% vs last week', isPositive: true },
      { label: 'Active Drivers', value: 12, change: '+1 vs last week', isPositive: true },
      {
        label: 'Avg Trip Time',
        value: '42 mins',
        change: '+2 mins vs last week',
        isPositive: false,
      },
    ],
    speed: [
      {
        label: 'Average Speed',
        value: '48 km/h',
        change: '+3 km/h vs last week',
        isPositive: false,
      },
      {
        label: 'Max Speed Recorded',
        value: '88 km/h',
        change: '95 km/h last week',
        isPositive: true,
      },
      {
        label: 'Compliance Score',
        value: '96.2%',
        change: '-1.4% vs last week',
        isPositive: false,
      },
      {
        label: 'Over-speed Duration',
        value: '8.4 mins',
        change: '+2.1 mins vs last week',
        isPositive: false,
      },
    ],
    alerts: [
      { label: 'Total Alert Logs', value: 28, change: '+4 vs last week', isPositive: false },
      { label: 'High Priority Alerts', value: 5, change: 'Same as last week', isPositive: true },
      { label: 'Resolved Alerts', value: 24, change: '+6 vs last week', isPositive: true },
      {
        label: 'Avg Response Time',
        value: '5.2 mins',
        change: '-0.8 mins vs last week',
        isPositive: true,
      },
    ],
  },
  monthly: {
    trips: [
      { label: 'Completed Trips', value: 365, change: '+14% vs last month', isPositive: true },
      {
        label: 'Total Distance',
        value: '5,420 km',
        change: '+16% vs last month',
        isPositive: true,
      },
      { label: 'Active Drivers', value: 15, change: '+2 vs last month', isPositive: true },
      {
        label: 'Avg Trip Time',
        value: '40 mins',
        change: '-1 min vs last month',
        isPositive: true,
      },
    ],
    speed: [
      {
        label: 'Average Speed',
        value: '46 km/h',
        change: '-1 km/h vs last month',
        isPositive: true,
      },
      {
        label: 'Max Speed Recorded',
        value: '95 km/h',
        change: '98 km/h last month',
        isPositive: true,
      },
      {
        label: 'Compliance Score',
        value: '97.1%',
        change: '+0.8% vs last month',
        isPositive: true,
      },
      {
        label: 'Over-speed Duration',
        value: '26.8 mins',
        change: '-4.2 mins vs last month',
        isPositive: true,
      },
    ],
    alerts: [
      { label: 'Total Alert Logs', value: 112, change: '-12 vs last month', isPositive: true },
      { label: 'High Priority Alerts', value: 18, change: '-4 vs last month', isPositive: true },
      { label: 'Resolved Alerts', value: 104, change: '+8 vs last month', isPositive: true },
      {
        label: 'Avg Response Time',
        value: '4.8 mins',
        change: '-1.1 mins vs last month',
        isPositive: true,
      },
    ],
  },
};

export const MOCK_TRENDS: Record<ReportPeriod, TrendPoint[]> = {
  daily: [
    { period: '08:00 AM', tripsCount: 3, complianceRate: 98, alertsCount: 0 },
    { period: '10:00 AM', tripsCount: 4, complianceRate: 95, alertsCount: 1 },
    { period: '12:00 PM', tripsCount: 2, complianceRate: 99, alertsCount: 0 },
    { period: '02:00 PM', tripsCount: 1, complianceRate: 100, alertsCount: 0 },
    { period: '04:00 PM', tripsCount: 2, complianceRate: 97, alertsCount: 2 },
  ],
  weekly: [
    { period: 'Mon', tripsCount: 15, complianceRate: 98, alertsCount: 3 },
    { period: 'Tue', tripsCount: 18, complianceRate: 95, alertsCount: 5 },
    { period: 'Wed', tripsCount: 16, complianceRate: 97, alertsCount: 4 },
    { period: 'Thu', tripsCount: 20, complianceRate: 92, alertsCount: 8 },
    { period: 'Fri', tripsCount: 15, complianceRate: 99, alertsCount: 2 },
  ],
  monthly: [
    { period: 'Week 1', tripsCount: 82, complianceRate: 97, alertsCount: 25 },
    { period: 'Week 2', tripsCount: 95, complianceRate: 94, alertsCount: 32 },
    { period: 'Week 3', tripsCount: 88, complianceRate: 98, alertsCount: 20 },
    { period: 'Week 4', tripsCount: 100, complianceRate: 96, alertsCount: 35 },
  ],
};
