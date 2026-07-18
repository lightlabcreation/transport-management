export interface AlertRecord {
  id: string;
  type: 'speed' | 'hazard' | 'safety' | 'group';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timeLabel: string;
  isRead: boolean;
  location?: string;
  extraInfo?: string;
}

export const ALERTS_VIEW_STATES = ['normal', 'loading', 'empty'] as const;
export type AlertsViewState = (typeof ALERTS_VIEW_STATES)[number];
