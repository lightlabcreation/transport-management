import { Link } from 'react-router';

interface AccessDeniedPageProps {
  message?: string;
  safeDestination?: string;
}

export function AccessDeniedPage({
  message = 'This demo profile does not include access to the requested frontend preview.',
  safeDestination = '/app/dashboard',
}: AccessDeniedPageProps) {
  return (
    <section
      aria-labelledby="access-denied-title"
      className="mx-auto max-w-2xl rounded-xl border border-warning/40 bg-surface p-page shadow-sm sm:p-section"
    >
      <p className="text-body-sm font-semibold uppercase tracking-wide text-warning">
        Frontend access preview
      </p>
      <h2 id="access-denied-title" className="mt-3 text-heading-md font-semibold">
        Access unavailable
      </h2>
      <p className="mt-3 text-body text-muted-foreground">{message}</p>
      <p className="mt-3 text-body-sm text-muted-foreground">
        Production authorization will require backend enforcement.
      </p>
      <Link
        to={safeDestination}
        className="mt-6 inline-flex min-h-control items-center rounded-md bg-primary px-4 font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      >
        Return to a safe page
      </Link>
    </section>
  );
}
