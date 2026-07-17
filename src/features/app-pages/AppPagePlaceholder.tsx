interface AppPagePlaceholderProps {
  title: string;
}

export function AppPagePlaceholder({ title }: AppPagePlaceholderProps) {
  return (
    <main className="min-h-screen bg-background px-gutter py-section text-foreground sm:px-page lg:px-section">
      <div className="mx-auto max-w-content rounded-xl border border-border bg-surface p-page shadow-sm sm:p-section">
        <p className="text-body-sm font-semibold uppercase tracking-wide text-primary">
          Planned application module
        </p>
        <h1 className="mt-3 text-heading-lg font-semibold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-body text-muted-foreground">
          Feature implementation will be added in a later batch.
        </p>
      </div>
    </main>
  );
}
