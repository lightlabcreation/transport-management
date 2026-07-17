export type ApplicationMode = 'tracking' | 'speed';

export interface ApplicationModeStore {
  getMode(): ApplicationMode | null;
  setMode(mode: ApplicationMode): void;
  clearMode(): void;
}
