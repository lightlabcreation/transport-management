import type { BroadcastScenario } from './whatsapp-invites.types';

export const MOCK_BROADCAST_SCENARIOS: BroadcastScenario[] = [
  {
    id: 'location',
    title: 'Live Location Sharing',
    description: 'Share a temporary tracking link with contacts to view real-time vehicle movement.',
    templateMessage: 'Hey! You can track our vehicle real-time delivery progress live on this map: https://transport-management.example.com/live/share-4890',
  },
  {
    id: 'invite',
    title: 'Group Invitation Link',
    description: 'Invite members to join your specific fleet tracking corridor group.',
    templateMessage: 'Hey! Join our driver tracking group on Kiyaan Transport Management system using this invite link: https://transport-management.example.com/join-group/G-7821',
  },
  {
    id: 'sos',
    title: 'Emergency SOS Broadcast',
    description: 'Instant notification text with dispatch instructions and distress alerts.',
    templateMessage: '⚠️ EMERGENCY SOS WARNING: Driver is requesting urgent assistance! Dispatching coordinates to Sarah Connor. Map reference: https://maps.google.com/?q=28.6139,77.2090',
  },
  {
    id: 'announcement',
    title: 'Admin Announcements',
    description: 'Broadcast route policy changes or general dispatch warnings to drivers.',
    templateMessage: '📢 dispatcher announcement: Express Highway Route speeds limit has been temporarily dropped to 60km/h due to road construction hazards.',
  },
];

export const MOCK_ANALYTICS = {
  totalInvitesSent: 142,
  activeLinksCount: 3,
  qrScansCount: 89,
};
