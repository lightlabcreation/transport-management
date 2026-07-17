export const summaryMetrics = [
  { label: 'Total Vehicles', value: '128', detail: 'Across all operations' },
  { label: 'Active Vehicles', value: '94', detail: '73% of the fleet' },
  { label: 'Total Drivers', value: '86', detail: '79 currently available' },
  { label: "Today's Trips", value: '42', detail: '18 completed' },
] as const;

export const operationMetrics = [
  { label: 'Running Trips', value: 17, tone: 'primary' },
  { label: 'Completed Trips', value: 18, tone: 'success' },
  { label: 'Pending Trips', value: 7, tone: 'warning' },
  { label: 'Alerts', value: 3, tone: 'danger' },
] as const;

export const weeklyActivity = [
  { day: 'Mon', trips: 28 },
  { day: 'Tue', trips: 36 },
  { day: 'Wed', trips: 31 },
  { day: 'Thu', trips: 44 },
  { day: 'Fri', trips: 39 },
  { day: 'Sat', trips: 24 },
  { day: 'Sun', trips: 18 },
] as const;

export const recentTrips = [
  {
    id: 'TR-2048',
    route: 'Noida → Gurugram',
    driver: 'Aarav Mehta',
    status: 'Running',
    time: '10:35',
  },
  {
    id: 'TR-2047',
    route: 'Delhi → Jaipur',
    driver: 'Meera Singh',
    status: 'Completed',
    time: '09:50',
  },
  {
    id: 'TR-2046',
    route: 'Ghaziabad → Faridabad',
    driver: 'Kabir Khan',
    status: 'Pending',
    time: '09:20',
  },
  {
    id: 'TR-2045',
    route: 'Noida → Delhi',
    driver: 'Ishita Rao',
    status: 'Completed',
    time: '08:45',
  },
] as const;

export const driverActivity = [
  { initials: 'AM', name: 'Aarav Mehta', activity: 'Started trip TR-2048', time: '12 min ago' },
  { initials: 'MS', name: 'Meera Singh', activity: 'Completed trip TR-2047', time: '28 min ago' },
  {
    initials: 'KK',
    name: 'Kabir Khan',
    activity: 'Vehicle inspection submitted',
    time: '46 min ago',
  },
] as const;

export const systemStatuses = [
  { label: 'GPS Status', value: 'Operational', detail: '126 devices connected', tone: 'success' },
  { label: 'API Status', value: 'Mock online', detail: 'Frontend simulation', tone: 'success' },
  { label: 'Notifications', value: '3 unread', detail: 'Requires attention', tone: 'warning' },
] as const;
