import type { ReactNode } from 'react';

interface AuthPageFrameProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  compact?: boolean;
}

export function AuthPageFrame({
  eyebrow,
  title,
  description,
  children,
  footer,
  compact = false,
}: AuthPageFrameProps) {
  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[minmax(20rem,0.9fr)_minmax(32rem,1.1fr)]">
      <aside className="relative hidden overflow-hidden bg-primary p-section text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10">
          <BrandMark inverse />
          <p className="mt-16 max-w-md text-heading-lg font-semibold leading-tight">
            Move people, journeys, and operations with confidence.
          </p>
          <p className="mt-4 max-w-md text-body-lg text-primary-foreground/80">
            One secure starting point for transport coordination, speed assistance, and safer
            journeys.
          </p>
        </div>

        <div className="relative z-10 grid gap-3 text-body-sm">
          <Benefit>Secure passwordless access</Benefit>
          <Benefit>Purpose-built for transport workflows</Benefit>
          <Benefit>Privacy-aware experiences for every mode</Benefit>
        </div>

        <div aria-hidden="true" className="absolute inset-0 opacity-25">
          <div className="absolute -right-20 top-24 size-72 rounded-full border border-primary-foreground/50" />
          <div className="absolute -right-8 top-36 size-48 rounded-full border border-primary-foreground/40" />
          <div className="absolute bottom-24 left-20 h-28 w-72 -rotate-12 rounded-full border-2 border-dashed border-primary-foreground/50" />
        </div>
      </aside>

      <section className="flex min-h-screen flex-col px-gutter py-6 sm:px-page lg:px-section lg:py-section">
        <div className="lg:hidden">
          <BrandMark />
        </div>

        <div className="flex flex-1 items-center justify-center py-section">
          <div className={compact ? 'w-full max-w-form' : 'w-full max-w-readable'}>
            <div className="mb-7">
              <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-heading-lg font-semibold tracking-tight">{title}</h1>
              <p className="mt-3 max-w-xl text-body text-muted-foreground">{description}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface p-page shadow-md sm:p-section">
              {children}
            </div>
            {footer ? <div className="mt-5 text-center text-body-sm">{footer}</div> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`grid size-10 place-items-center rounded-lg font-semibold ${
          inverse ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
        }`}
      >
        TM
      </span>
      <span className="text-body font-semibold">Transport Management</span>
    </div>
  );
}

function Benefit({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 p-3">
      <span
        aria-hidden="true"
        className="grid size-6 place-items-center rounded-full bg-primary-foreground/20"
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
