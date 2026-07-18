import type { RouteOption, RecentDestination } from './navigation.types';

export const MOCK_ROUTES: RouteOption[] = [
  {
    id: 'route-1',
    name: 'Expressway Route (Fastest)',
    distance: 14.5,
    duration: '22 mins',
    trafficStatus: 'light',
    roadHazard: null,
  },
  {
    id: 'route-2',
    name: 'Sector 62 Main Road Bypass',
    distance: 12.0,
    duration: '28 mins',
    trafficStatus: 'moderate',
    roadHazard: 'Minor water logging near subway',
  },
  {
    id: 'route-3',
    name: 'Service Lane Inner Route',
    distance: 11.2,
    duration: '35 mins',
    trafficStatus: 'heavy',
    roadHazard: 'Road construction at lane 4 crossing',
  },
];

export const MOCK_RECENT_DESTINATIONS: RecentDestination[] = [
  {
    id: 'dest-1',
    label: 'St. Mary School Ground, Sector 12',
    origin: 'School Depot Yard',
    destination: 'St. Mary School Ground, Sector 12',
  },
  {
    id: 'dest-2',
    label: 'Sector 62 Transit Hub',
    origin: 'School Depot Yard',
    destination: 'Sector 62 Transit Hub',
  },
  {
    id: 'dest-3',
    label: 'Main Bus Terminal, City Center',
    origin: 'School Depot Yard',
    destination: 'Main Bus Terminal, City Center',
  },
];
