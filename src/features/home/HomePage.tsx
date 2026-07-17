/* eslint-disable max-lines -- HOME-001 intentionally keeps its bounded presentation in one page file. */
import { useEffect, useState, type ReactNode } from 'react';

import { Link } from 'react-router';

const primaryLinkClasses =
  'inline-flex min-h-control items-center justify-center rounded-md bg-primary px-5 py-3 text-body font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';
const secondaryLinkClasses =
  'inline-flex min-h-control items-center justify-center rounded-md border border-border bg-surface px-5 py-3 text-body font-semibold text-foreground transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring';

const features = [
  {
    symbol: '◫',
    title: 'Fleet visibility',
    description:
      'Keep vehicles, availability, and operational summaries organized in one clear frontend workspace.',
  },
  {
    symbol: '◎',
    title: 'Driver coordination',
    description:
      'Present driver activity and assignments clearly without implying a live backend connection.',
  },
  {
    symbol: '↗',
    title: 'Trip management',
    description: 'Review planned, running, pending, and completed journey states at a glance.',
  },
  {
    symbol: '⌖',
    title: 'GPS-ready presentation',
    description:
      'Prepare for consent-based location experiences without claiming that real GPS is connected.',
  },
  {
    symbol: '!',
    title: 'Safety and speed assistance',
    description:
      'Surface speed and safety information through focused, driver-conscious interfaces.',
  },
] as const;

const steps = [
  {
    title: 'Choose experience',
    description: 'Select Tracking and Groups or the private Speed Only experience.',
  },
  {
    title: 'Create account',
    description: 'Register securely with your mobile number—no password required.',
  },
  {
    title: 'Verify mobile',
    description: 'Complete the frontend OTP challenge through the approved mock flow.',
  },
  {
    title: 'Open dashboard',
    description: 'Enter a responsive operations workspace built around transport activity.',
  },
] as const;

export function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false);
    }
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className="sticky top-0 z-header border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-content items-center justify-between gap-5 px-gutter sm:px-page lg:px-section">
          <Brand />
          <nav aria-label="Primary navigation" className="hidden items-center gap-7 lg:flex">
            <SectionLink href="#features">Features</SectionLink>
            <SectionLink href="#solutions">Solutions</SectionLink>
            <SectionLink href="#how-it-works">How it works</SectionLink>
          </nav>
          <div className="hidden items-center gap-3 lg:flex">
            <Link className={secondaryLinkClasses} to="/auth/login">
              Sign in
            </Link>
            <Link className={primaryLinkClasses} to="/onboarding/language">
              Get started
            </Link>
          </div>
          <button
            type="button"
            className="grid size-control place-items-center rounded-md border border-border bg-surface text-heading-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring lg:hidden"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span aria-hidden="true">{isMenuOpen ? '×' : '☰'}</span>
          </button>
        </div>

        {isMenuOpen ? (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-border bg-surface px-gutter py-5 lg:hidden"
          >
            <div className="mx-auto grid max-w-content gap-2">
              <SectionLink href="#features" onClick={closeMenu}>
                Features
              </SectionLink>
              <SectionLink href="#solutions" onClick={closeMenu}>
                Solutions
              </SectionLink>
              <SectionLink href="#how-it-works" onClick={closeMenu}>
                How it works
              </SectionLink>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Link className={secondaryLinkClasses} to="/auth/login" onClick={closeMenu}>
                  Sign in
                </Link>
                <Link className={primaryLinkClasses} to="/onboarding/language" onClick={closeMenu}>
                  Get started
                </Link>
              </div>
            </div>
          </nav>
        ) : null}
      </header>

      <main>
        <h2 className="sr-only">Transport Management</h2>
        <section className="relative border-b border-border bg-surface px-gutter py-16 sm:px-page lg:px-section lg:py-24">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden opacity-40">
            <div className="absolute -right-28 top-10 size-96 rounded-full border border-primary/20" />
            <div className="absolute -right-12 top-28 size-64 rounded-full border border-primary/20" />
          </div>
          <div className="relative mx-auto grid max-w-content items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
                Built for every journey
              </p>
              <h1 className="mt-4 max-w-3xl text-heading-xl font-semibold tracking-tight">
                Transport operations, coordinated with clarity.
              </h1>
              <p className="mt-5 max-w-2xl text-body-lg text-muted-foreground">
                GPS Track &amp; Speed brings fleet visibility, driver coordination, trip oversight,
                and speed-assistance experiences into one modern frontend.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className={primaryLinkClasses} to="/onboarding/language">
                  Get started{' '}
                  <span aria-hidden="true" className="ml-2">
                    →
                  </span>
                </Link>
                <Link className={secondaryLinkClasses} to="/auth/login">
                  Sign in
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-body-sm text-muted-foreground">
                <span>✓ Passwordless access</span>
                <span>✓ Consent-first onboarding</span>
                <span>✓ Responsive from 360px</span>
              </div>
            </div>
            <OperationsVisual />
          </div>
        </section>

        <section
          id="features"
          aria-labelledby="features-heading"
          className="scroll-mt-24 px-gutter py-16 sm:px-page lg:px-section lg:py-24"
        >
          <SectionHeading
            eyebrow="Operational highlights"
            title="Everything your transport UI needs to stay focused"
            description="Clear frontend experiences for daily operations, designed to connect to approved services later."
            id="features-heading"
          />
          <div className="mx-auto mt-10 grid max-w-content gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-border bg-surface p-page shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-lg bg-primary/10 text-heading-sm font-semibold text-primary"
                >
                  {feature.symbol}
                </span>
                <h3 className="mt-5 text-heading-sm font-semibold">{feature.title}</h3>
                <p className="mt-2 text-body text-muted-foreground">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="solutions"
          aria-labelledby="solutions-heading"
          className="scroll-mt-24 bg-surface-muted px-gutter py-16 sm:px-page lg:px-section lg:py-24"
        >
          <SectionHeading
            eyebrow="Two focused modes"
            title="One product, two distinct experiences"
            description="Choose collaborative tracking and groups or a private speed-only experience."
            id="solutions-heading"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
            <ModeCard
              title="Tracking and Groups"
              description="Coordinate groups, permitted member visibility, trips, and speed assistance through one governed experience."
              capabilities={[
                'Group coordination and membership states',
                'Consent-based tracking presentation',
                'Trips, alerts, and operational summaries',
              ]}
            />
            <ModeCard
              title="Speed Only"
              description="Focus on private speed and journey assistance without group, member, or shared-tracking features."
              capabilities={[
                'Private individual experience',
                'Speed and navigation-ready presentation',
                'No group or member visibility',
              ]}
            />
          </div>
        </section>

        <section
          id="how-it-works"
          aria-labelledby="how-heading"
          className="scroll-mt-24 px-gutter py-16 sm:px-page lg:px-section lg:py-24"
        >
          <SectionHeading
            eyebrow="Simple setup"
            title="From first visit to operations overview"
            description="A clear passwordless frontend journey in four steps."
            id="how-heading"
          />
          <ol className="mx-auto mt-10 grid max-w-content gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-border bg-surface p-page shadow-sm"
              >
                <span className="grid size-9 place-items-center rounded-full bg-primary text-body-sm font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-heading-sm font-semibold">{step.title}</h3>
                <p className="mt-2 text-body-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="preview-heading"
          className="bg-primary px-gutter py-16 text-primary-foreground sm:px-page lg:px-section lg:py-24"
        >
          <div className="mx-auto grid max-w-content items-center gap-10 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="text-body-sm font-semibold uppercase tracking-wide text-primary-foreground/70">
                Dashboard preview
              </p>
              <h2 id="preview-heading" className="mt-3 text-heading-lg font-semibold">
                See operations without losing the big picture
              </h2>
              <p className="mt-4 text-body text-primary-foreground/80">
                A compact presentation of the metrics and activity your future connected workspace
                can support.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  className="inline-flex min-h-control items-center justify-center rounded-md bg-primary-foreground px-5 py-3 font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
                  to="/onboarding/language"
                >
                  Start onboarding
                </Link>
                <Link
                  className="inline-flex min-h-control items-center justify-center rounded-md border border-primary-foreground/40 px-5 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
                  to="/auth/login"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </section>

        <section
          aria-labelledby="trust-heading"
          className="px-gutter py-16 sm:px-page lg:px-section lg:py-24"
        >
          <div className="mx-auto grid max-w-content gap-8 rounded-2xl border border-border bg-surface p-page shadow-sm md:grid-cols-[0.8fr_1.2fr] md:p-section">
            <div>
              <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
                Trust through clarity
              </p>
              <h2 id="trust-heading" className="mt-3 text-heading-lg font-semibold">
                Permission choices stay understandable
              </h2>
              <p className="mt-4 text-body text-muted-foreground">
                The frontend introduces capabilities before any future browser or device request.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <TrustItem title="Passwordless mobile access">
                Use the approved mobile and OTP journey without password screens.
              </TrustItem>
              <TrustItem title="Consent-first introduction">
                Understand why a capability may be useful before a future prompt.
              </TrustItem>
              <TrustItem title="Mode-specific explanations">
                See different permission context for Tracking and Speed Only.
              </TrustItem>
              <TrustItem title="User-controlled onboarding">
                Choose when to sign in or create an account.
              </TrustItem>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface-muted px-gutter py-16 text-center sm:px-page lg:px-section">
          <div className="mx-auto max-w-readable">
            <h2 className="text-heading-lg font-semibold">Ready to coordinate the road ahead?</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-muted-foreground">
              Choose your experience and explore the complete frontend journey.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link className={primaryLinkClasses} to="/onboarding/language">
                Get started
              </Link>
              <Link className={secondaryLinkClasses} to="/auth/login">
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground px-gutter py-10 text-background sm:px-page lg:px-section">
        <div className="mx-auto grid max-w-content gap-8 md:grid-cols-[1fr_auto_auto]">
          <div>
            <Brand inverse />
            <p className="mt-4 max-w-sm text-body-sm text-background/70">
              A modern frontend for clearer transport coordination and safer journey experiences.
            </p>
          </div>
          <nav aria-label="Footer sections" className="grid content-start gap-3 text-body-sm">
            <p className="font-semibold">Explore</p>
            <a href="#features" className="text-background/70 hover:text-background">
              Features
            </a>
            <a href="#solutions" className="text-background/70 hover:text-background">
              Solutions
            </a>
            <a href="#how-it-works" className="text-background/70 hover:text-background">
              How it works
            </a>
          </nav>
          <nav aria-label="Footer account links" className="grid content-start gap-3 text-body-sm">
            <p className="font-semibold">Account</p>
            <Link to="/auth/login" className="text-background/70 hover:text-background">
              Sign in
            </Link>
            <Link to="/auth/register" className="text-background/70 hover:text-background">
              Create account
            </Link>
            <Link to="/legal/terms" className="text-background/70 hover:text-background">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      to="/"
      className="inline-flex min-h-control items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      <span
        aria-hidden="true"
        className={`grid size-10 place-items-center rounded-lg font-semibold ${inverse ? 'bg-background text-foreground' : 'bg-primary text-primary-foreground'}`}
      >
        GTS
      </span>
      <span className="font-semibold">GPS Track &amp; Speed</span>
    </Link>
  );
}

function SectionLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="inline-flex min-h-control items-center rounded-md px-2 text-body-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
    >
      {children}
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id: string;
}) {
  return (
    <div className="mx-auto max-w-readable text-center">
      <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-heading-lg font-semibold tracking-tight">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-body text-muted-foreground">{description}</p>
    </div>
  );
}

function OperationsVisual() {
  return (
    <div
      aria-label="Transport operations preview"
      className="relative rounded-2xl border border-border bg-background p-4 shadow-lg sm:p-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="font-semibold">Operations overview</p>
          <p className="text-body-sm text-muted-foreground">Frontend preview</p>
        </div>
        <span className="rounded-full bg-success/10 px-3 py-1 text-body-sm font-medium text-success">
          Ready
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <PreviewMetric label="Vehicles ready" value="94" />
        <PreviewMetric label="Trips today" value="42" />
        <PreviewMetric label="Drivers active" value="79" />
        <PreviewMetric label="Open alerts" value="3" />
      </div>
      <div className="mt-4 rounded-xl bg-surface p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Trip TR-2048</p>
            <p className="text-body-sm text-muted-foreground">Noida → Gurugram</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-body-sm font-medium text-primary">
            Running
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-3">
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-heading-sm font-semibold">{value}</p>
    </div>
  );
}

function ModeCard({
  title,
  description,
  capabilities,
}: {
  title: string;
  description: string;
  capabilities: readonly string[];
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-page shadow-sm sm:p-section">
      <span
        aria-hidden="true"
        className="grid size-12 place-items-center rounded-xl bg-primary/10 text-heading-sm font-semibold text-primary"
      >
        {title.charAt(0)}
      </span>
      <h3 className="mt-5 text-heading-md font-semibold">{title}</h3>
      <p className="mt-3 text-body text-muted-foreground">{description}</p>
      <ul className="mt-6 flex-1 space-y-3">
        {capabilities.map((item) => (
          <li key={item} className="flex gap-3 text-body-sm">
            <span aria-hidden="true" className="text-success">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>
      <Link className={`${primaryLinkClasses} mt-7`} to="/onboarding/language">
        Choose this experience
      </Link>
    </article>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-2xl bg-background p-4 text-foreground shadow-lg sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">Dashboard</p>
          <p className="text-body-sm text-muted-foreground">Operations at a glance</p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-body-sm">Preview</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PreviewMetric label="Total Vehicles" value="128" />
        <PreviewMetric label="Active Trips" value="17" />
        <PreviewMetric label="Drivers" value="86" />
        <PreviewMetric label="Alerts" value="3" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-xl border border-border p-4">
          <p className="text-body-sm font-medium">Weekly activity</p>
          <div aria-hidden="true" className="mt-5 flex h-24 items-end gap-2">
            {[45, 70, 55, 90, 75, 50, 35].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t bg-primary/70"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <p className="text-body-sm font-medium">System</p>
          <p className="mt-4 text-body-sm text-success">● GPS ready</p>
          <p className="mt-2 text-body-sm text-success">● Mock API</p>
        </div>
      </div>
    </div>
  );
}

function TrustItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rounded-lg bg-surface-muted p-4">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-body-sm text-muted-foreground">{children}</p>
    </article>
  );
}
