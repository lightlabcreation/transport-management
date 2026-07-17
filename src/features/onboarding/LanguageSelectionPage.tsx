import { useState, type FormEvent } from 'react';

import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import type { OnboardingLanguage } from './onboardingState';
import { OnboardingFrame } from './OnboardingFrame';

export function LanguageSelectionPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<OnboardingLanguage>('en');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate('/onboarding/welcome', { state: { language } });
  }

  return (
    <OnboardingFrame
      step={1}
      eyebrow="Make it yours"
      title="Choose your language"
      description="Select the language you want to use across your transport-management experience."
    >
      <div className="rounded-xl border border-border bg-surface p-page shadow-md sm:p-section">
        <div className="mb-6 flex items-start gap-4 rounded-lg bg-surface-muted p-4">
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 font-semibold text-primary"
          >
            EN
          </span>
          <div>
            <h2 className="text-body font-semibold">Approved language</h2>
            <p className="mt-1 text-body-sm text-muted-foreground">
              English is currently available. Additional languages will appear after product
              approval.
            </p>
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="onboarding-language">Language</Label>
            <select
              id="onboarding-language"
              name="language"
              value={language}
              onChange={(event) => setLanguage(event.currentTarget.value as OnboardingLanguage)}
              className="min-h-control w-full rounded-md border border-input bg-surface px-3 py-2 text-body text-foreground"
            >
              <option value="en">English</option>
            </select>
          </div>
          <Button type="submit" size="lg" fullWidth>
            Continue
          </Button>
        </form>
      </div>
    </OnboardingFrame>
  );
}
