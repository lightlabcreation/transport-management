import { useRef, useState, type FormEvent } from 'react';

import { Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { hasLanguageState, type ApplicationMode } from './onboardingState';
import { OnboardingFrame } from './OnboardingFrame';

export function ModeSelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupRef = useRef<HTMLFieldSetElement>(null);
  const [mode, setMode] = useState<ApplicationMode>();
  const [error, setError] = useState<string>();

  if (!hasLanguageState(location.state)) {
    return <Navigate to="/onboarding/language" replace />;
  }
  const languageState = location.state;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mode) {
      setError('Select an application mode to continue.');
      groupRef.current?.focus();
      return;
    }
    void navigate('/onboarding/permissions', { state: { ...languageState, mode } });
  }

  return (
    <OnboardingFrame
      wide
      step={3}
      eyebrow="Your experience"
      title="Select an application mode"
      description="Choose the experience that matches how you travel or coordinate. Review each option before continuing."
    >
      <form onSubmit={handleSubmit} noValidate>
        <fieldset
          ref={groupRef}
          tabIndex={-1}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'mode-error' : undefined}
        >
          <legend className="sr-only">Application mode</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <ModeOption
              value="tracking"
              checked={mode === 'tracking'}
              onChange={setMode}
              title="Tracking and groups"
              description="Group coordination, permitted member tracking, and speed assistance."
            />
            <ModeOption
              value="speed"
              checked={mode === 'speed'}
              onChange={setMode}
              title="Speed only"
              description="Private speed assistance without groups, members, or shared tracking."
            />
          </div>
        </fieldset>
        {error ? (
          <p id="mode-error" className="mt-2 text-body-sm text-danger">
            {error}
          </p>
        ) : null}
        <Button className="mx-auto mt-8 flex max-w-form" type="submit" size="lg" fullWidth>
          Continue
        </Button>
      </form>
    </OnboardingFrame>
  );
}

interface ModeOptionProps {
  value: ApplicationMode;
  checked: boolean;
  onChange: (mode: ApplicationMode) => void;
  title: string;
  description: string;
}

function ModeOption({ value, checked, onChange, title, description }: ModeOptionProps) {
  return (
    <label
      className={`flex min-h-44 cursor-pointer gap-4 rounded-xl border bg-surface p-page shadow-sm transition-colors ${checked ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50 hover:bg-surface-muted'}`}
    >
      <input
        type="radio"
        name="applicationMode"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 size-5 shrink-0 accent-primary"
      />
      <span>
        <span className="block text-heading-sm font-semibold">{title}</span>
        <span className="mt-3 block text-body text-muted-foreground">{description}</span>
        <span className="mt-5 block text-body-sm font-medium text-primary">
          {checked ? 'Selected' : 'Select this mode'}
        </span>
      </span>
    </label>
  );
}
