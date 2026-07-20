import type { EmergencyContact, SafetySettings } from './sos.types';

export const INITIAL_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-1',
    name: 'Sarah Connor',
    relationship: 'Spouse',
    phone: '+1 (555) 901-2384',
    priority: 1,
  },
  {
    id: 'contact-2',
    name: 'John Connor',
    relationship: 'Son',
    phone: '+1 (555) 321-4567',
    priority: 2,
  },
];

export const DEFAULT_SAFETY_SETTINGS: SafetySettings = {
  crashDetection: true,
  speedAlerts: true,
  seatBeltAlarm: false,
  schoolZoneNotify: true,
  redLightCamera: true,
  gforceImpact: true,
  quickShareLocation: false,
};
