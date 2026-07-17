import { Link } from 'react-router';

export function TermsPlaceholderPage() {
  return (
    <main className="min-h-screen bg-background px-gutter py-section text-foreground sm:px-page lg:py-16">
      <article className="mx-auto w-full max-w-readable overflow-hidden rounded-xl border border-border bg-surface shadow-md">
        <header className="border-b border-border bg-surface-muted p-page sm:p-section">
          <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">Legal</p>
          <h1 className="mt-2 text-heading-lg font-semibold">Terms</h1>
          <p className="mt-2 text-body text-muted-foreground">Transport Management</p>
        </header>
        <div className="p-page sm:p-section">
          <div className="rounded-lg border border-border bg-background p-5">
            <h2 className="text-heading-sm font-semibold">Content preparation in progress</h2>
            <p className="mt-3 text-body text-muted-foreground">
              Terms content will be provided later. No legal terms are available for review on this
              placeholder page.
            </p>
          </div>
          <Link
            className="mt-7 inline-flex min-h-control items-center font-medium text-primary underline-offset-4 hover:underline"
            to="/auth/login"
          >
            <span aria-hidden="true">←&nbsp;</span> Back to sign in
          </Link>
        </div>
      </article>
    </main>
  );
}
