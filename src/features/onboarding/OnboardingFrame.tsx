import type { ReactNode } from 'react';

interface OnboardingFrameProps {
  step: 1 | 2 | 3 | 4;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  wide?: boolean;
}

export function OnboardingFrame({
  step,
  eyebrow,
  title,
  description,
  children,
  wide = false,
}: OnboardingFrameProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface px-gutter py-4 sm:px-page lg:px-section">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-lg bg-primary font-semibold text-primary-foreground"
            >
              TM
            </span>
            <span className="text-body font-semibold">Transport Management</span>
          </div>
          <span className="text-body-sm text-muted-foreground">Step {step} of 4</span>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-gutter py-section sm:px-page lg:px-section lg:py-16">
        <div
          className="mb-10 grid grid-cols-4 gap-2"
          aria-label={`Onboarding progress: step ${step} of 4`}
        >
          {[1, 2, 3, 4].map((item) => (
            <span
              key={item}
              aria-hidden="true"
              className={`h-1.5 rounded-full ${item <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <div className={wide ? 'mx-auto max-w-5xl' : 'mx-auto max-w-readable'}>
          <div className="mb-8 text-center">
            <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-heading-lg font-semibold tracking-tight">{title}</h1>
            <p className="mx-auto mt-3 max-w-2xl text-body text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </main>
  );
}
