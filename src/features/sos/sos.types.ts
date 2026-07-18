export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  priority: number;
}

export interface SafetySettings {
  crashDetection: boolean;
  speedAlerts: boolean;
  seatBeltAlarm: boolean;
  schoolZoneNotify: boolean;
}
