export type DemoAccessProfileId =
  | 'group-owner'
  | 'delegated-group-administrator'
  | 'group-admin'
  | 'moderator'
  | 'member'
  | 'group-guest';

export interface DemoAccessProfile {
  id: DemoAccessProfileId;
  name: string;
  description: string;
}

export interface DemoAccessStore {
  getProfile(): DemoAccessProfile | null;
  setProfile(profile: DemoAccessProfile): void;
  clearProfile(): void;
}
