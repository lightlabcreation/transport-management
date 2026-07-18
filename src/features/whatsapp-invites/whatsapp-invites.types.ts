export type ExpirationOption = '24-hours' | '7-days' | 'never';

export interface InviteQrDetails {
  link: string;
  expiresIn: ExpirationOption;
  clicksCount: number;
}

export type BroadcastType = 'location' | 'invite' | 'sos' | 'announcement';

export interface BroadcastScenario {
  id: BroadcastType;
  title: string;
  description: string;
  templateMessage: string;
}
