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
}: AuthPageFrameProps) {
  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[44%_56%]">
      <aside className="relative hidden bg-primary p-8 xl:p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-center lg:gap-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
        <div className="relative z-10 space-y-4">
          <BrandMark inverse />
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 px-3 py-1 text-body-xs font-semibold uppercase tracking-wider text-primary-foreground shadow-2xs">
            <span className="size-2 rounded-full bg-success animate-pulse" /> Live Telemetry & GPS Tracking Active
          </div>
          <h1 className="text-heading-lg font-bold leading-tight tracking-tight">
            Move people, journeys, and operations with confidence.
          </h1>
          <p className="max-w-md text-body-sm text-primary-foreground/85 leading-relaxed">
            One secure, passwordless starting point for transport coordination, real-time speed assistance, and road safety oversight.
          </p>
        </div>

        <div className="relative z-10 max-w-md grid gap-2.5 text-body-xs font-medium pt-2">
          <Benefit>Secure passwordless mobile OTP authentication</Benefit>
          <Benefit>Real-time TomTom speed detection & HUD routing</Benefit>
          <Benefit>Role-gated workspaces for Owners, Admins & Fleet Drivers</Benefit>
        </div>

        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute -right-20 top-24 size-72 rounded-full border border-primary-foreground/50" />
          <div className="absolute -right-8 top-36 size-48 rounded-full border border-primary-foreground/40" />
          <div className="absolute bottom-16 left-16 h-28 w-72 -rotate-12 rounded-full border-2 border-dashed border-primary-foreground/50" />
        </div>
      </aside>

      <section className="flex min-h-screen flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="lg:hidden mb-6">
          <BrandMark />
        </div>

        <div className="w-full max-w-[560px] mx-auto">
          <div className="mb-3.5">
            <p className="text-body-xs font-bold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
            <h2 className="mt-0.5 text-heading-md font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-body-xs text-muted-foreground leading-snug">{description}</p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-md">
            {children}
          </div>
          {footer ? <div className="mt-3.5 text-center text-body-xs">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className={`grid size-9 place-items-center rounded-lg font-bold text-body-sm ${
          inverse ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
        }`}
      >
        TM
      </span>
      <span className="text-body-sm font-bold tracking-tight">Transport Management</span>
    </div>
  );
}

function Benefit({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2">
      <span
        aria-hidden="true"
        className="grid size-5 place-items-center rounded-full bg-primary-foreground/20 text-[11px] font-bold shrink-0"
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}
