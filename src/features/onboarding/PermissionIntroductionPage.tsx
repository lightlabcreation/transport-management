import { Navigate, useLocation, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';

import { hasModeState } from './onboardingState';
import { OnboardingFrame } from './OnboardingFrame';

export function PermissionIntroductionPage() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!hasModeState(location.state)) {
    return <Navigate to="/onboarding/language" replace />;
  }
  const { mode } = location.state;

  return (
    <OnboardingFrame
      wide
      step={4}
      eyebrow="Privacy first"
      title="Before you continue"
      description="Understand how optional device capabilities support your experience. Nothing is requested on this page."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-xl border border-border bg-surface p-page shadow-sm">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-lg bg-primary/10 text-heading-sm text-primary"
          >
            ⌖
          </span>
          <h2 className="mt-5 text-heading-sm font-semibold">Location</h2>
          <p className="mt-2 text-body-sm text-muted-foreground">
            {mode === 'tracking'
              ? 'Location may be needed for tracking features and is always subject to your device consent and group policy.'
              : 'Location may be needed for speed and navigation features and is always subject to your device consent.'}
          </p>
        </article>
        <article className="rounded-xl border border-border bg-surface p-page shadow-sm">
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-lg bg-primary/10 text-heading-sm text-primary"
          >
            ◉
          </span>
          <h2 className="mt-5 text-heading-sm font-semibold">Notifications</h2>
          <p className="mt-2 text-body-sm text-muted-foreground">
            Notifications may later support relevant safety and account updates. No notification
            permission is requested on this page.
          </p>
        </article>
      </div>

      <p className="mt-5 rounded-lg border border-border bg-surface-muted p-4 text-center text-body-sm text-muted-foreground">
        Your browser or device will ask for permission later, only when a feature needs it.
      </p>

      <div className="mx-auto mt-8 grid max-w-readable gap-3 sm:grid-cols-2">
        <Button size="lg" onClick={() => void navigate('/auth/register')}>
          Create account
        </Button>
        <Button size="lg" variant="outline" onClick={() => void navigate('/auth/login')}>
          Sign in
        </Button>
      </div>
    </OnboardingFrame>
  );
}
