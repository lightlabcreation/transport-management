import { Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { hasLanguageState } from './onboardingState';
import { OnboardingFrame } from './OnboardingFrame';

export function WelcomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!hasLanguageState(location.state)) {
    return <Navigate to="/onboarding/language" replace />;
  }
  const state = location.state;

  return (
    <OnboardingFrame
      wide
      step={2}
      eyebrow="Welcome aboard"
      title="Transport management built around every journey"
      description="Coordinate the people who matter or stay focused on your own drive with a clear, privacy-aware experience."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-surface p-page shadow-sm transition-colors hover:border-primary/50">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-lg bg-primary/10 text-heading-sm text-primary"
          >
            ◎
          </span>
          <h2 className="mt-5 text-heading-sm font-semibold">Tracking and groups</h2>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Group coordination, permitted location sharing, and speed assistance.
          </p>
          <p className="mt-4 text-body-sm font-medium text-primary">Coordinate together</p>
        </article>
        <article className="rounded-xl border border-border bg-surface p-page shadow-sm transition-colors hover:border-primary/50">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-lg bg-primary/10 text-heading-sm text-primary"
          >
            ↗
          </span>
          <h2 className="mt-5 text-heading-sm font-semibold">Speed only</h2>
          <p className="mt-2 text-body-sm text-muted-foreground">
            A private speed-assistance experience without group or member features.
          </p>
          <p className="mt-4 text-body-sm font-medium text-primary">Drive independently</p>
        </article>
      </div>

      <div className="mx-auto mt-8 flex max-w-readable flex-col gap-3 sm:flex-row">
        <Button className="sm:flex-1" onClick={() => void navigate('/onboarding/mode', { state })}>
          Continue
        </Button>
        <Button
          className="sm:flex-1"
          variant="outline"
          onClick={() => void navigate('/auth/login')}
        >
          Sign in
        </Button>
      </div>
    </OnboardingFrame>
  );
}
