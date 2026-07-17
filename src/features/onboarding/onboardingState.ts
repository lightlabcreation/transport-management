export type OnboardingLanguage = 'en';
export type ApplicationMode = 'tracking' | 'speed';

export interface LanguageStepState {
  language: OnboardingLanguage;
}

export interface ModeStepState extends LanguageStepState {
  mode: ApplicationMode;
}

export function hasLanguageState(value: unknown): value is LanguageStepState {
  return Boolean(
    value && typeof value === 'object' && 'language' in value && value.language === 'en',
  );
}

export function hasModeState(value: unknown): value is ModeStepState {
  return (
    hasLanguageState(value) &&
    'mode' in value &&
    (value.mode === 'tracking' || value.mode === 'speed')
  );
}
